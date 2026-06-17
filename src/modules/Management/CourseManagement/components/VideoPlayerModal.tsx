import React from "react";
import { Video } from "lucide-react";
import CModal from "@/components/UI/Modal";
import { VideoPlayer } from "@/components/Player/VideoPlayer";

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title?: string;
  transcriptUrl?: string;
  onDurationDetected?: (duration: number) => void;
}

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  isOpen,
  onClose,
  url,
  title,
}) => {
  // Extract URL if the user pasted an iframe embed code
  let actualUrl = url || "";
  if (actualUrl.includes("<iframe") && actualUrl.includes("src=")) {
    const match = actualUrl.match(/src=["'](.*?)["']/);
    if (match && match[1]) {
      actualUrl = match[1];
    }
  }

  const getYoutubeId = (urlStr: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = urlStr.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const youtubeId = getYoutubeId(actualUrl);
  const isYouTube = !!youtubeId;
  const isHls = actualUrl.includes(".m3u8");
  const type = isHls ? "application/x-mpegURL" : "video/mp4";

  return (
    <CModal
      title={
        <div className="flex items-center gap-2">
          <Video className="w-5 h-5 text-blue-500" />
          <span className="truncate max-w-[400px] sm:max-w-md font-semibold text-gray-800">
            {title || "Xem trước Video"}
          </span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
      destroyOnClose
      styles={{ body: { padding: 0 } }}
      className="rounded-xl overflow-hidden"
    >
      <div className="w-full bg-black relative overflow-hidden aspect-video">
        {isOpen && actualUrl ? (
          isYouTube ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
              title={title || "YouTube video player"}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          ) : (
            <div className="w-full h-full [&>div]:h-full [&>div]:w-full [&>div]:rounded-none [&>div]:border-0 [&>div]:shadow-none">
              <VideoPlayer src={actualUrl} type={type} />
            </div>
          )
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50 text-sm gap-2">
            <Video className="w-8 h-8 text-white/30" />
            <span>Chưa có dữ liệu video</span>
          </div>
        )}
      </div>
    </CModal>
  );
};

export default VideoPlayerModal;
