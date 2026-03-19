// /components/media/video-loop.tsx

"use client";

import { cn } from "@/lib/utils"; // if you use clsx/tailwind merge utility
import React, { useEffect, useRef, useState } from "react";

interface VideoLoopProps {
  /** Source URL of the video */
  src: string;
  /** Poster image (optional, used before video loads) */
  poster?: string;
  /** Should the video autoplay on mount (default: true) */
  autoPlay?: boolean;
  /** Should the video be muted (default: true) */
  muted?: boolean;
  /** Should the video show controls (default: false) */
  controls?: boolean;
  /** Should the video loop continuously (default: true) */
  loop?: boolean;
  /** Optional className for styling */
  className?: string;
  /** Optional flag for intersection-based play/pause */
  pauseWhenOffscreen?: boolean;
}

/**
 * A reusable looping video component with autoplay, intersection observer pause logic,
 * and full Tailwind compatibility.
 */
const VideoLoop: React.FC<VideoLoopProps> = ({
  src,
  poster,
  autoPlay = true,
  muted = true,
  controls = false,
  loop = true,
  className,
  pauseWhenOffscreen = true,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  // Intersection observer for pausing video when offscreen
  useEffect(() => {
    if (!pauseWhenOffscreen || !videoRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.25 } // video must be at least 25% visible
    );

    observer.observe(videoRef.current);

    return () => observer.disconnect();
  }, [pauseWhenOffscreen]);

  // Control playback depending on visibility
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (pauseWhenOffscreen) {
      if (isVisible) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    }
  }, [isVisible, pauseWhenOffscreen]);

  return (
    <video
      ref={videoRef}
      className={cn("w-full h-full object-cover", className)}
      src={src}
      poster={poster}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      playsInline
      controls={controls}
      preload="auto"
    />
  );
};

export default VideoLoop;
