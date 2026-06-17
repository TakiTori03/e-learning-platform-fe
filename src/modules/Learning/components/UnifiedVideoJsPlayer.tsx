import { useEffect, useRef, useImperativeHandle, forwardRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import videojs from "video.js";
import "videojs-youtube";
import "video.js/dist/video-js.css";
import { Show } from "@/components/UI/Template";

// Hotfix to prevent deprecation warnings for videojs.createTimeRange from third-parties
interface IVideoJsExtended {
  createTimeRange_patched?: boolean;
  createTimeRange?: (...args: unknown[]) => unknown;
  time?: {
    createTimeRanges: (...args: unknown[]) => unknown;
  };
  createTimeRanges?: (...args: unknown[]) => unknown;
  xhr?: (options: unknown, callback: unknown) => unknown;
}

const videojsAny = videojs as unknown as IVideoJsExtended;
if (videojsAny && !videojsAny.createTimeRange_patched) {
  const originalCreateTimeRange = videojsAny.createTimeRange;
  if (originalCreateTimeRange) {
    videojsAny.createTimeRange = function (...args: unknown[]) {
      if (videojsAny.time && typeof videojsAny.time.createTimeRanges === "function") {
        return videojsAny.time.createTimeRanges(...args);
      } else if (typeof videojsAny.createTimeRanges === "function") {
        return videojsAny.createTimeRanges(...args);
      }
      return originalCreateTimeRange.apply(this, args);
    };
    videojsAny.createTimeRange_patched = true;
  }
}

// Global XHR Interceptor for HLS AES-128 secure key decryption
const originalXhr = videojsAny.xhr;
if (originalXhr) {
  videojsAny.xhr = function (options: any, callback: any) {
    if (options?.uri && (options.uri.includes("/media/keys/") || options.uri.includes("/keys/"))) {
      const gatewayBase = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const segments = options.uri.split("/");
      const folderName = segments[segments.length - 1].split("?")[0];

      if (folderName) {
        options.uri = `${gatewayBase}/media/keys/${folderName}`;
      }
      options.withCredentials = true; // Attach Auth Cookies
    }
    return originalXhr(options, callback);
  };
}

export interface VideoJsPlayerRef {
  seekTo: (seconds: number) => void;
  getCurrentTime: () => number;
}

interface UnifiedVideoJsPlayerProps {
  src: string;
  type: "application/x-mpegURL" | "video/youtube";
  poster?: string;
  playing?: boolean;
  initialTime?: number;
  subtitleUrl?: string;
  onProgress?: (state: { played: number; playedSeconds: number }) => void;
  onComplete: () => void;
  onError?: () => void;
  onDurationDetected?: (duration: number) => void;
  lessonName?: string;
  courseName?: string;
  onNextLesson?: () => void;
  onPrevLesson?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

interface IPlayerOptions extends NonNullable<Parameters<typeof videojs>[1]> {
  techOrder?: string[];
  youtube?: {
    ytControls?: number;
    rel?: number;
    modestbranding?: number;
    iv_load_policy?: number;
    cc_load_policy?: number;
    origin?: string;
  };
  crossOrigin?: string;
  html5?: {
    vhs?: {
      withCredentials?: boolean;
    };
  };
}

const PLAYER_STYLE = `
  .vjs-theme-premium.video-js { background-color: #020617; font-family: inherit; border-radius: 12px; }
  .vjs-is-youtube .vjs-loading-spinner { display: none !important; }
  .vjs-theme-premium .vjs-big-play-button {
    background-color: rgba(34, 114, 235, 0.9) !important;
    border: none !important; width: 80px !important; height: 80px !important; line-height: 80px !important;
    border-radius: 50% !important; box-shadow: 0 10px 25px -5px rgba(34, 114, 235, 0.4) !important;
    transition: all 0.3s ease !important;
  }
  .vjs-theme-premium:hover .vjs-big-play-button { transform: scale(1.1); background-color: #2272eb !important; }
  
  .vjs-theme-premium .vjs-control-bar {
    background: linear-gradient(0deg, rgba(2, 6, 23, 0.95) 0%, rgba(2, 6, 23, 0.7) 70%, rgba(2, 6, 23, 0) 100%) !important;
    height: 56px !important;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    display: flex !important;
    align-items: center !important;
  }
  
  /* Center all native button icons vertically in the 56px control bar */
  .vjs-theme-premium .vjs-control-bar .vjs-control:not(.vjs-progress-control) {
    height: 100% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  .vjs-theme-premium .vjs-control-bar .vjs-button > .vjs-icon-placeholder:before,
  .vjs-theme-premium .vjs-control-bar .vjs-control:not(.vjs-progress-control):before {
    line-height: 56px !important;
    height: 100% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    top: 0 !important;
  }
  
  /* Align volume panel children */
  .vjs-theme-premium .vjs-control-bar .vjs-volume-panel {
    display: flex !important;
    align-items: center !important;
    height: 100% !important;
  }
  
  /* Fix layout centering for playback rate and time display controls */
  .vjs-theme-premium .vjs-control-bar .vjs-playback-rate .vjs-playback-rate-value {
    line-height: 56px !important;
    height: 100% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  .vjs-theme-premium .vjs-control-bar .vjs-time-control {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    height: 100% !important;
    line-height: 56px !important;
  }

  /* Explicit flex ordering for controls to match YouTube layout.
     Left Side: Prev Button (1), Play/Pause (2), Next Button (3), Volume (4), Time Displays (5)
     Spacer: (6) to fill remaining width and push later items to the right
     Right Side: Speed/Playback Rate (7), Subtitles/CC (8), Fullscreen (9)
  */
  .vjs-theme-premium .vjs-prev-holder { order: 1 !important; }
  .vjs-theme-premium .vjs-play-control { order: 2 !important; }
  .vjs-theme-premium .vjs-next-holder { order: 3 !important; }
  .vjs-theme-premium .vjs-volume-panel { order: 4 !important; }
  .vjs-theme-premium .vjs-current-time,
  .vjs-theme-premium .vjs-time-divider,
  .vjs-theme-premium .vjs-duration,
  .vjs-theme-premium .vjs-time-control {
    order: 5 !important;
  }
  
  .vjs-theme-premium .vjs-spacer,
  .vjs-theme-premium .vjs-custom-control-spacer {
    order: 6 !important;
    display: block !important;
    flex: 1 1 auto !important;
    height: 100% !important;
  }
  
  .vjs-theme-premium .vjs-playback-rate { order: 7 !important; }
  .vjs-theme-premium .vjs-subs-caps-button,
  .vjs-theme-premium .vjs-subtitles-button {
    order: 8 !important;
  }
  .vjs-theme-premium .vjs-fullscreen-control { order: 9 !important; }

  /* Progress control positioning at the top of the control bar */
  .vjs-theme-premium .vjs-progress-control {
    position: absolute !important;
    left: 0 !important;
    right: 0 !important;
    width: 100% !important;
    height: 4px !important;
    top: -4px !important;
    background: rgba(255, 255, 255, 0.1) !important;
    cursor: pointer !important;
    transition: height 0.1s ease, top 0.1s ease !important;
    z-index: 10 !important;
    display: block !important;
    padding: 0 !important;
    margin: 0 !important;
  }
  .vjs-theme-premium:hover .vjs-progress-control,
  .vjs-theme-premium .vjs-progress-control:hover {
    height: 8px !important;
    top: -8px !important;
  }
  .vjs-theme-premium .vjs-progress-holder {
    height: 100% !important;
    margin: 0 !important;
    border-radius: 0 !important;
    background-color: rgba(255, 255, 255, 0.2) !important;
  }
  .vjs-theme-premium .vjs-play-progress {
    background-color: #2272eb !important;
    height: 100% !important;
  }
  .vjs-theme-premium .vjs-load-progress {
    background-color: rgba(255, 255, 255, 0.3) !important;
    height: 100% !important;
  }
  .vjs-theme-premium .vjs-play-progress:before {
    display: none !important;
  }
  .vjs-theme-premium:hover .vjs-play-progress:before,
  .vjs-theme-premium .vjs-progress-control:hover .vjs-play-progress:before {
    display: inline-block !important;
    font-size: 10px !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    color: #fff !important;
  }

  @keyframes ripple-effect {
    0% { transform: scale(0.8); opacity: 0; }
    50% { opacity: 0.8; }
    100% { transform: scale(1.2); opacity: 0; }
  }
  .animate-ripple {
    animation: ripple-effect 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  }

  .learning-player-container:fullscreen {
    max-width: none !important;
    width: 100vw !important;
    height: 100vh !important;
    border-radius: 0 !important;
    border: none !important;
    background-color: black !important;
  }
  .learning-player-container:-webkit-full-screen {
    max-width: none !important;
    width: 100vw !important;
    height: 100vh !important;
    border-radius: 0 !important;
    border: none !important;
    background-color: black !important;
  }
  .learning-player-container:fullscreen .w-full.aspect-video,
  .learning-player-container:fullscreen .aspect-video {
    aspect-ratio: auto !important;
    height: 100% !important;
    width: 100% !important;
    border-radius: 0 !important;
    border: none !important;
  }
  .learning-player-container:-webkit-full-screen .w-full.aspect-video,
  .learning-player-container:-webkit-full-screen .aspect-video {
    aspect-ratio: auto !important;
    height: 100% !important;
    width: 100% !important;
    border-radius: 0 !important;
    border: none !important;
  }
  .learning-player-container:fullscreen .video-js {
    width: 100% !important;
    height: 100% !important;
    padding-top: 0 !important;
    border-radius: 0 !important;
  }
  .learning-player-container:-webkit-full-screen .video-js {
    width: 100% !important;
    height: 100% !important;
    padding-top: 0 !important;
    border-radius: 0 !important;
  }

  /* Title overlay & vignette styles */
  .vjs-title-overlay {
    display: none !important;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }
  .video-js.vjs-fullscreen.vjs-user-active .vjs-title-overlay {
    display: flex !important;
    opacity: 1;
  }
  .video-js.vjs-fullscreen.vjs-user-inactive .vjs-title-overlay {
    display: flex !important;
    opacity: 0;
    pointer-events: none;
  }

  .vjs-top-vignette {
    display: none !important;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }
  .video-js.vjs-fullscreen.vjs-user-active .vjs-top-vignette {
    display: block !important;
    opacity: 1;
  }
  .video-js.vjs-fullscreen.vjs-user-inactive .vjs-top-vignette {
    display: block !important;
    opacity: 0;
    pointer-events: none;
  }

  /* Custom control bar nav placeholder/button styling */
  .vjs-custom-nav-holder {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    height: 100% !important;
    width: 36px !important;
  }
  .vjs-custom-nav-holder::before {
    display: none !important;
    content: none !important;
  }
  .vjs-custom-nav-btn {
    background: none !important;
    border: none !important;
    color: #fff !important;
    cursor: pointer !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 100% !important;
    height: 100% !important;
    opacity: 0.75 !important;
    transition: opacity 0.2s, transform 0.2s !important;
    outline: none !important;
    padding: 0 !important;
    margin: 0 !important;
  }
  .vjs-custom-nav-btn:hover:not(:disabled) {
    opacity: 1 !important;
    transform: scale(1.15) !important;
  }
  .vjs-custom-nav-btn:active:not(:disabled) {
    transform: scale(0.9) !important;
  }
  .vjs-custom-nav-btn:disabled {
    opacity: 0.25 !important;
    cursor: not-allowed !important;
  }
`;

// Subtitle language metadata configuration is now supplied dynamically via props

/**
 * 🎬 Unified Video.js Player Component
 * Supports: HLS (AES-128 secure single-key decryption), YouTube, Resume Playback, Subtitles, Memory Optimization.
 */
const UnifiedVideoJsPlayer = forwardRef<VideoJsPlayerRef, UnifiedVideoJsPlayerProps>(
  (
    {
      src,
      type,
      poster,
      playing = false,
      initialTime = 0,
      subtitleUrl,
      onProgress,
      onComplete,
      onError,
      onDurationDetected,
      lessonName,
      courseName,
      onNextLesson,
      onPrevLesson,
      hasNext,
      hasPrev,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<ReturnType<typeof videojs> | null>(null);
    const [playerEl, setPlayerEl] = useState<HTMLElement | null>(null);
    const [prevBtnEl, setPrevBtnEl] = useState<HTMLDivElement | null>(null);
    const [nextBtnEl, setNextBtnEl] = useState<HTMLDivElement | null>(null);
    
    // Sync callbacks into refs to avoid closure stale issues
    const callbacksRef = useRef({ onProgress, onComplete, onError, onDurationDetected });
    useEffect(() => {
      callbacksRef.current = { onProgress, onComplete, onError, onDurationDetected };
    }, [onProgress, onComplete, onError, onDurationDetected]);

    const stateRef = useRef({
      hasTriggeredComplete: false
    });

    const isMountedRef = useRef(true);
    useEffect(() => {
      isMountedRef.current = true;
      return () => {
        isMountedRef.current = false;
      };
    }, []);

    const [feedback, setFeedback] = useState<{
      show: boolean;
      type: "rewind" | "forward" | null;
      amount: number;
    }>({ show: false, type: null, amount: 0 });

    const feedbackTimeoutRef = useRef<any>(null);

    const triggerFeedback = useCallback((type: "rewind" | "forward", amount: number) => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
      setFeedback({ show: true, type, amount });
      feedbackTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          setFeedback({ show: false, type: null, amount: 0 });
        }
      }, 800);
    }, []);

    const [volumeFeedback, setVolumeFeedback] = useState<{
      show: boolean;
      volume: number;
      muted: boolean;
    }>({ show: false, volume: 0, muted: false });

    const volumeTimeoutRef = useRef<any>(null);

    const triggerVolumeFeedback = useCallback((vol: number, muted: boolean) => {
      if (volumeTimeoutRef.current) {
        clearTimeout(volumeTimeoutRef.current);
      }
      setVolumeFeedback({ show: true, volume: Math.round(vol * 100), muted });
      volumeTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          setVolumeFeedback((prev) => ({ ...prev, show: false }));
        }
      }, 1000);
    }, []);

    useEffect(() => {
      return () => {
        if (feedbackTimeoutRef.current) {
          clearTimeout(feedbackTimeoutRef.current);
        }
        if (volumeTimeoutRef.current) {
          clearTimeout(volumeTimeoutRef.current);
        }
      };
    }, []);

    // Expose control API to parent
    useImperativeHandle(
      ref,
      () => ({
        seekTo: (seconds: number) => {
          if (playerRef.current) {
            playerRef.current.currentTime(seconds);
          }
        },
        getCurrentTime: () => {
          return playerRef.current ? playerRef.current.currentTime() || 0 : 0;
        },
      }),
      []
    );

    // Lifecycle: Init and Destroy Player
    useEffect(() => {
      if (!containerRef.current || !src) return;

      containerRef.current.innerHTML = "";
      stateRef.current.hasTriggeredComplete = false;

      const isYoutube = type === "video/youtube";

      const videoElement = document.createElement("video");
      videoElement.className = `video-js vjs-big-play-centered vjs-theme-premium w-full h-full ${isYoutube ? "vjs-is-youtube" : ""}`;
      videoElement.setAttribute("crossorigin", "anonymous");
      videoElement.setAttribute("playsinline", "true");

      // Initial subtitle setup
      if (subtitleUrl && !isYoutube) {
        const trackElement = document.createElement("track");
        trackElement.kind = "subtitles";
        trackElement.src = subtitleUrl;
        trackElement.srclang = "auto";
        trackElement.label = "Subtitles";
        videoElement.appendChild(trackElement);
      }

      containerRef.current.appendChild(videoElement);

      const playerOptions: IPlayerOptions = {
        controls: true,
        responsive: true,
        fluid: true,
        poster,
        playbackRates: [0.5, 1, 1.25, 1.5, 2],
        sources: [{ src, type }],
        techOrder: isYoutube ? ["youtube"] : ["html5"],
        controlBar: {
          playToggle: true,
          volumePanel: { inline: true },
          currentTimeDisplay: true,
          timeDivider: true,
          durationDisplay: true,
          progressControl: true,
          liveDisplay: false,
          seekToLive: false,
          remainingTimeDisplay: false,
          playbackRateMenuButton: true,
          chaptersButton: false,
          descriptionsButton: false,
          subsCapsButton: true,
          audioTrackButton: false,
          pictureInPictureToggle: false,
          fullscreenToggle: true,
        },
        crossOrigin: "anonymous",
      };

      if (!isYoutube) {
        playerOptions.html5 = { vhs: { withCredentials: true } };
      } else {
        playerOptions.youtube = {
          ytControls: 0,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          cc_load_policy: 1,
          origin: window.location.origin,
        };
      }

      const player = videojs(videoElement, playerOptions, () => {
        if (initialTime > 0) {
          player.currentTime(initialTime);
        }
        if (playing) {
          player.play()?.catch(() => {});
        }
      });

      playerRef.current = player;
      const playerHtmlEl = player.el() as HTMLElement;
      setPlayerEl(playerHtmlEl);

      // Create Next and Prev placeholders inside control bar next to play toggle
      const controlBar = playerHtmlEl.querySelector(".vjs-control-bar");
      const playControl = playerHtmlEl.querySelector(".vjs-play-control");

      let prevPlaceholder: HTMLDivElement | null = null;
      let nextPlaceholder: HTMLDivElement | null = null;

      if (controlBar && playControl) {
        prevPlaceholder = document.createElement("div");
        prevPlaceholder.className = "vjs-control vjs-button vjs-custom-nav-holder vjs-prev-holder";
        controlBar.insertBefore(prevPlaceholder, playControl);

        nextPlaceholder = document.createElement("div");
        nextPlaceholder.className = "vjs-control vjs-button vjs-custom-nav-holder vjs-next-holder";
        controlBar.insertBefore(nextPlaceholder, playControl.nextSibling);
      }

      setPrevBtnEl(prevPlaceholder);
      setNextBtnEl(nextPlaceholder);

      // Helper function to check if we are in fullscreen
      const checkIsFullscreen = () => {
        return !!document.fullscreenElement || 
               !!(document as any).webkitFullscreenElement || 
               !!(document as any).mozFullScreenElement || 
               !!(document as any).msFullscreenElement;
      };

      // Check if we are already fullscreen (e.g. from previous lesson pagination)
      if (checkIsFullscreen()) {
        const currentFullscreenEl = document.fullscreenElement || 
                                     (document as any).webkitFullscreenElement || 
                                     (document as any).mozFullScreenElement || 
                                     (document as any).msFullscreenElement;
        if (currentFullscreenEl && currentFullscreenEl.classList.contains("learning-player-container")) {
          playerHtmlEl.classList.add("vjs-fullscreen");
        }
      }

      // Override player's fullscreen requests to target the persistent container
      player.requestFullscreen = function () {
        const container = containerRef.current?.closest(".learning-player-container");
        if (container) {
          if (container.requestFullscreen) {
            container.requestFullscreen();
          } else if ((container as any).webkitRequestFullscreen) {
            (container as any).webkitRequestFullscreen();
          } else if ((container as any).mozRequestFullScreen) {
            (container as any).mozRequestFullScreen();
          } else if ((container as any).msRequestFullscreen) {
            (container as any).msRequestFullscreen();
          }
        }
        return Promise.resolve();
      };

      player.exitFullscreen = function () {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          (document as any).msExitFullscreen();
        }
        return Promise.resolve();
      };

      player.isFullscreen = function (isFS?: any): any {
        if (typeof isFS === "boolean") {
          if (isFS) {
            playerHtmlEl.classList.add("vjs-fullscreen");
          } else {
            playerHtmlEl.classList.remove("vjs-fullscreen");
          }
          return player;
        }
        return checkIsFullscreen();
      };

      // Synchronize videojs internal vjs-fullscreen classes when container fullscreen changes
      const handleFullscreenChange = () => {
        const isFS = checkIsFullscreen();
        if (isFS) {
          playerHtmlEl.classList.add("vjs-fullscreen");
        } else {
          playerHtmlEl.classList.remove("vjs-fullscreen");
        }
      };

      document.addEventListener("fullscreenchange", handleFullscreenChange);
      document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.addEventListener("mozfullscreenchange", handleFullscreenChange);
      document.addEventListener("MSFullscreenChange", handleFullscreenChange);

      // Restore pending fullscreen state synchronously within user gesture tick
      const pendingFullscreen = sessionStorage.getItem("pending_fullscreen");
      if (pendingFullscreen === "true") {
        sessionStorage.removeItem("pending_fullscreen");
        player.requestFullscreen();
      }

      // Keyboard shortcuts handler
      const handleGlobalKeyDown = (e: KeyboardEvent) => {
        const activeEl = document.activeElement;
        if (activeEl) {
          const tag = activeEl.tagName.toUpperCase();
          if (
            tag === "INPUT" ||
            tag === "TEXTAREA" ||
            tag === "SELECT" ||
            activeEl.getAttribute("contenteditable") === "true" ||
            (activeEl as HTMLElement).isContentEditable
          ) {
            return;
          }
        }

        const key = e.key;
        const code = e.code;

        // F: Fullscreen works outside of fullscreen to enter, and inside to exit
        if (key === "f" || key === "F") {
          e.preventDefault();
          e.stopPropagation();
          if (checkIsFullscreen()) {
            player.exitFullscreen();
          } else {
            player.requestFullscreen();
          }
          return;
        }

        // Space: Play/Pause - works in both fullscreen and normal mode
        if (key === " " || code === "Space") {
          e.preventDefault();
          e.stopPropagation();
          if (player.paused()) {
            player.play()?.catch(() => {});
          } else {
            player.pause();
          }
          return;
        }

        // Other shortcuts only work in fullscreen mode
        if (!checkIsFullscreen()) {
          return;
        }

        // ArrowLeft: Seek backward 10s
        if (key === "ArrowLeft") {
          e.preventDefault();
          e.stopPropagation();
          const current = player.currentTime() || 0;
          player.currentTime(Math.max(0, current - 10));
          triggerFeedback("rewind", 10);
        }
        // ArrowRight: Seek forward 10s
        else if (key === "ArrowRight") {
          e.preventDefault();
          e.stopPropagation();
          const current = player.currentTime() || 0;
          const duration = player.duration() || 0;
          player.currentTime(Math.min(duration, current + 10));
          triggerFeedback("forward", 10);
        }
        // ArrowUp: Volume up 5%
        else if (key === "ArrowUp") {
          e.preventDefault();
          e.stopPropagation();
          const vol = player.volume() ?? 0;
          const newVol = Math.min(1, vol + 0.05);
          player.volume(newVol);
          if (player.muted()) {
            player.muted(false);
          }
          triggerVolumeFeedback(newVol, false);
        }
        // ArrowDown: Volume down 5%
        else if (key === "ArrowDown") {
          e.preventDefault();
          e.stopPropagation();
          const vol = player.volume() ?? 0;
          const newVol = Math.max(0, vol - 0.05);
          player.volume(newVol);
          if (player.muted() && newVol > 0) {
            player.muted(false);
          }
          triggerVolumeFeedback(newVol, false);
        }
      };

      window.addEventListener("keydown", handleGlobalKeyDown, true);

      // Double-click seek gesture handler
      const handleDoubleClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (
          target.closest(".vjs-control-bar") ||
          target.closest(".vjs-big-play-button") ||
          target.closest(".vjs-modal-dialog") ||
          target.closest(".vjs-menu")
        ) {
          return;
        }

        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const clickX = e.clientX - rect.left;
        const isLeftHalf = clickX < rect.width / 2;

        if (isLeftHalf) {
          const current = player.currentTime() || 0;
          player.currentTime(Math.max(0, current - 10));
          triggerFeedback("rewind", 10);
        } else {
          const current = player.currentTime() || 0;
          const duration = player.duration() || 0;
          player.currentTime(Math.min(duration, current + 10));
          triggerFeedback("forward", 10);
        }
      };

      const containerEl = containerRef.current;
      if (containerEl) {
        containerEl.addEventListener("dblclick", handleDoubleClick);
      }

      // No auto-showing for subtitles by default

      // 1. Time Update & Complete triggers
      player.on("timeupdate", () => {
        if (!isMountedRef.current) return;
        const currentTime = player.currentTime() || 0;
        const duration = player.duration();

        if (duration && duration > 0) {
          const progress = currentTime / duration;
          
          callbacksRef.current.onProgress?.({
            played: progress,
            playedSeconds: currentTime,
          });

          if (progress >= 0.9 && !stateRef.current.hasTriggeredComplete) {
            stateRef.current.hasTriggeredComplete = true; 
            callbacksRef.current.onComplete();
          }
        }
      });

      // 2. Video Ended
      player.on("ended", () => {
        if (!isMountedRef.current) return;
        if (!stateRef.current.hasTriggeredComplete) {
          stateRef.current.hasTriggeredComplete = true;
          callbacksRef.current.onComplete();
        }
      });

      // 3. Error handling
      player.on("error", () => {
        if (!isMountedRef.current) return;
        console.error("Video.js Error Intercepted:", player.error());
        callbacksRef.current.onError?.();
      });

      // 4. Duration detection
      player.on("durationchange", () => {
        if (!isMountedRef.current) return;
        const duration = player.duration() || 0;
        if (duration > 0) {
          callbacksRef.current.onDurationDetected?.(duration);
        }
      });

      // Cleanup
      return () => {
        setPlayerEl(null);
        setPrevBtnEl(null);
        setNextBtnEl(null);
        window.removeEventListener("keydown", handleGlobalKeyDown, true);
        document.removeEventListener("fullscreenchange", handleFullscreenChange);
        document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
        document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
        document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
        if (containerEl) {
          containerEl.removeEventListener("dblclick", handleDoubleClick);
        }
        if (playerRef.current) {
          playerRef.current.dispose();
          playerRef.current = null;
        }
      };
    }, [src, type]); // Depend ONLY on src and type!

    // Play/Pause control from parent state without rebuilding player
    useEffect(() => {
      const player = playerRef.current;
      if (!player) return;

      if (playing && player.paused()) {
        player.play()?.catch(() => {});
      } else if (!playing && !player.paused()) {
        player.pause();
      }
    }, [playing]);

    // Handle dynamic poster changes without rebuilding player
    useEffect(() => {
      const player = playerRef.current;
      if (player && poster) {
        player.poster(poster);
      }
    }, [poster]);

    // Handle dynamic subtitle updates without rebuilding player
    useEffect(() => {
      const player = playerRef.current;
      const isYoutube = type === "video/youtube";
      if (!player || isYoutube || !subtitleUrl) return;

      // Remove existing remote tracks to prevent duplicates
      const remoteTracks = player.remoteTextTracks();
      if (remoteTracks) {
        for (let i = remoteTracks.length - 1; i >= 0; i--) {
          player.removeRemoteTextTrack((remoteTracks as any)[i]);
        }
      }

      // Add updated track
      player.addRemoteTextTrack(
        {
          kind: "subtitles",
          src: subtitleUrl,
          srclang: "auto",
          label: "Subtitles",
        },
        true
      );
    }, [subtitleUrl, type]);

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ minHeight: "360px" }}>
        <style dangerouslySetInnerHTML={{ __html: PLAYER_STYLE }} />
        <div ref={containerRef} className="w-full h-full" />

        {/* Portals into the custom control bar placeholders */}
        {prevBtnEl && createPortal(
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrevLesson?.();
            }}
            disabled={!hasPrev}
            className="vjs-custom-nav-btn vjs-prev-btn"
            title="Bài học trước (Shift + P)"
          >
            <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>,
          prevBtnEl
        )}

        {nextBtnEl && createPortal(
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNextLesson?.();
            }}
            disabled={!hasNext}
            className="vjs-custom-nav-btn vjs-next-btn"
            title="Bài học tiếp theo (Shift + N)"
          >
            <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </button>,
          nextBtnEl
        )}

        {playerEl && createPortal(
          <>
            {/* Top Gradient Vignette - Visible in fullscreen on active */}
            <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/80 to-transparent pointer-events-none z-10 vjs-top-vignette" />

            {/* Top-Left Header Overlay (Course & Lesson Title) - Visible in fullscreen on active */}
            <Show>
              <Show.When isTrue={!!(lessonName || courseName)}>
                <div className="absolute top-6 left-6 z-[9999] pointer-events-none flex flex-col gap-1 vjs-title-overlay select-none">
                  {courseName && (
                    <span 
                      className="text-white/60 text-xs font-semibold tracking-wide uppercase drop-shadow-md"
                      style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
                    >
                      {courseName}
                    </span>
                  )}
                  {lessonName && (
                    <span 
                      className="text-white text-lg font-bold tracking-normal drop-shadow-lg"
                      style={{ textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}
                    >
                      {lessonName}
                    </span>
                  )}
                </div>
              </Show.When>
            </Show>

            {/* Volume & Mute HUD Center/Top Notification */}
            <Show>
              <Show.When isTrue={volumeFeedback.show}>
                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none bg-black/75 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center gap-3 border border-white/10 shadow-2xl transition-all duration-300">
                  {volumeFeedback.muted ? (
                    <svg className="w-5 h-5 text-red-500 fill-current" viewBox="0 0 24 24">
                      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.21.05-.42.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                    </svg>
                  ) : volumeFeedback.volume === 0 ? (
                    <svg className="w-5 h-5 text-slate-400 fill-current" viewBox="0 0 24 24">
                      <path d="M7 9v6h4l5 5V4l-5 5H7z" />
                    </svg>
                  ) : volumeFeedback.volume < 50 ? (
                    <svg className="w-5 h-5 text-blue-400 fill-current" viewBox="0 0 24 24">
                      <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-blue-500 fill-current" viewBox="0 0 24 24">
                      <path d="M3 9v6h4l5 5V4L9 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                    </svg>
                  )}
                  <span className="text-sm font-semibold select-none">
                    {volumeFeedback.muted ? "Đã tắt tiếng" : `Âm lượng: ${volumeFeedback.volume}%`}
                  </span>
                  {!volumeFeedback.muted && (
                    <div className="w-16 h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-100" 
                        style={{ width: `${volumeFeedback.volume}%` }}
                      />
                    </div>
                  )}
                </div>
              </Show.When>
            </Show>

            {/* Rewind Feedback Overlay */}
            <Show>
              <Show.When isTrue={feedback.show && feedback.type === "rewind"}>
                <div className="absolute left-0 top-0 bottom-0 w-1/2 flex items-center justify-center pointer-events-none bg-gradient-to-r from-black/40 to-transparent z-[9999] transition-all duration-300">
                  <div className="flex flex-col items-center gap-2 animate-ripple bg-black/60 backdrop-blur-md rounded-full w-24 h-24 justify-center border border-white/10 shadow-xl">
                    <svg className="w-8 h-8 text-white fill-current" viewBox="0 0 24 24">
                      <path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z" />
                    </svg>
                    <span className="text-white text-xs font-semibold uppercase tracking-wider select-none">-{feedback.amount}s</span>
                  </div>
                </div>
              </Show.When>
            </Show>

            {/* Forward Feedback Overlay */}
            <Show>
              <Show.When isTrue={feedback.show && feedback.type === "forward"}>
                <div className="absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-center pointer-events-none bg-gradient-to-l from-black/40 to-transparent z-[9999] transition-all duration-300">
                  <div className="flex flex-col items-center gap-2 animate-ripple bg-black/60 backdrop-blur-md rounded-full w-24 h-24 justify-center border border-white/10 shadow-xl">
                    <svg className="w-8 h-8 text-white fill-current" viewBox="0 0 24 24">
                      <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" />
                    </svg>
                    <span className="text-white text-xs font-semibold uppercase tracking-wider select-none">+{feedback.amount}s</span>
                  </div>
                </div>
              </Show.When>
            </Show>
          </>,
          playerEl
        )}
      </div>
    );
  }
);

UnifiedVideoJsPlayer.displayName = "UnifiedVideoJsPlayer";

export default UnifiedVideoJsPlayer;
