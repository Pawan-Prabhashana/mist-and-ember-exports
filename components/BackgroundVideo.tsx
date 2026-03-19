"use client";

import Image from "next/image";

/**
 * Hero background. Uses static image for instant load (video was 57MB, too slow).
 * To restore video: run ./scripts/compress-hero-video.sh first, then swap back.
 */
export default function BackgroundVideo() {
  return (
    <div className="absolute inset-0 z-0 h-full w-full">
      <Image
        src="/images/hero/hero-tea-3840x2160.jpg"
        alt=""
        fill
        className="object-cover"
        priority
        sizes="100vw"
        aria-hidden
      />
    </div>
  );
}
