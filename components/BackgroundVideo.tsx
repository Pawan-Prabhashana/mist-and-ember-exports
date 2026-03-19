"use client";

import { useEffect, useRef } from "react";

/**
 * Hero background video. 60s loop, ~20MB compressed.
 * Safari-compatible: muted/playsInline required for autoplay.
 */
export default function BackgroundVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    const tryPlay = () => {
      v.muted = true;
      v.playsInline = true;
      v.play().catch(() => {});
    };

    tryPlay();
    const onData = () => tryPlay();
    v.addEventListener("loadeddata", onData, { once: true });
    v.addEventListener("canplay", onData, { once: true });

    const resume = () => {
      tryPlay();
      window.removeEventListener("pointerdown", resume);
      window.removeEventListener("touchend", resume);
      window.removeEventListener("keydown", resume);
    };
    window.addEventListener("pointerdown", resume, { once: true });
    window.addEventListener("touchend", resume, { once: true });
    window.addEventListener("keydown", resume, { once: true });

    return () => {
      v.removeEventListener("loadeddata", onData);
      v.removeEventListener("canplay", onData);
    };
  }, []);

  return (
    <video
      ref={ref}
      className="absolute inset-0 z-0 h-full w-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster="/images/hero/hero-tea-3840x2160.jpg"
      aria-hidden="true"
      style={{ objectFit: "cover" }}
      controls={false}
      disablePictureInPicture
      // @ts-expect-error fetchPriority is valid for faster loading
      fetchPriority="high"
    >
      <source src="/video/hero-leaves.mp4" type="video/mp4" />
    </video>
  );
}
