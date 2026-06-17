import { useEffect, useRef, type FC } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

interface VideoPlayerProps {
  src: string;
  type?: string; // e.g. "application/x-mpegURL" cho HLS stream, hoặc "video/mp4" cho file tĩnh
  poster?: string;
  onTimeUpdate?: (currentTime: number) => void;
  onEnded?: () => void;
}

interface IVideoJsXhrOptions {
  uri: string;
  withCredentials?: boolean;
}

export const VideoPlayer: FC<VideoPlayerProps> = ({
  src,
  type = "application/x-mpegURL",
  poster,
  onTimeUpdate,
  onEnded,
}) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<ReturnType<typeof videojs> | null>(null);

  const callbacksRef = useRef({ onTimeUpdate, onEnded });
  useEffect(() => {
    callbacksRef.current = { onTimeUpdate, onEnded };
  }, [onTimeUpdate, onEnded]);

  useEffect(() => {
    if (!videoRef.current) return;

    // Tạo thẻ video-js động để ngăn lỗi rác bộ nhớ khi chuyển bài học
    const videoElement = document.createElement("video-js");
    videoElement.classList.add("vjs-big-play-centered", "vjs-theme-city");
    videoRef.current.appendChild(videoElement);

    const isHls = type === "application/x-mpegURL";
    const videojsAny = videojs as unknown as {
      xhr?: (options: IVideoJsXhrOptions, callback: unknown) => unknown;
    };
    const originalXhr = videojsAny.xhr;

    if (isHls && originalXhr) {
      videojsAny.xhr = function (options: IVideoJsXhrOptions, callback: unknown) {
        if (options?.uri && (options.uri.includes("/media/keys/") || options.uri.includes("/keys/"))) {
          const gatewayBase = import.meta.env.VITE_API_URL || "http://localhost:8080";
          const segments = options.uri.split("/");
          const folderName = segments[segments.length - 1].split("?")[0];

          if (folderName) {
            options.uri = `${gatewayBase}/media/keys/${folderName}`;
          }
          options.withCredentials = true; // Đính kèm bảo mật Cookie Payload
        }
        return originalXhr(options, callback);
      };
    }

    const options: NonNullable<Parameters<typeof videojs>[1]> & {
      crossOrigin?: string;
      html5?: {
        vhs?: {
          withCredentials?: boolean;
        };
      };
    } = {
      autoplay: false,
      controls: true,
      responsive: true,
      fluid: true,
      poster,
      playbackRates: [0.5, 1, 1.25, 1.5, 2],
      sources: [{ src, type }],
      controlBar: {
        skipButtons: {
          forward: 10,
          backward: 10,
        },
      },
      crossOrigin: "anonymous",
    };

    if (isHls) {
      options.html5 = { vhs: { withCredentials: true } };
    }

    const player = (playerRef.current = videojs(videoElement, options, () => {}));

    player.on("timeupdate", () => {
      callbacksRef.current.onTimeUpdate?.(player.currentTime() || 0);
    });

    player.on("ended", () => {
      callbacksRef.current.onEnded?.();
    });

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
      if (isHls && originalXhr) {
        videojsAny.xhr = originalXhr;
      }
    };
  }, [src, type, poster]);

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 shadow-md">
      <div data-vjs-player ref={videoRef} />
    </div>
  );
};
