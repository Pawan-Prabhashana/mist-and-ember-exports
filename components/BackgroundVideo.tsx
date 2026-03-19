"use client";

import { useEffect, useRef } from "react";

/**
 * Hero background video. Primary: hero-leaves.mp4. Fallback: cinnamon-closeup.webm.
 * Safari-compatible: explicit muted/playsInline in JS, play() on canplay, user-gesture fallback.
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

    const onCanPlay = () => tryPlay();
    v.addEventListener("loadeddata", onCanPlay, { once: true });
    v.addEventListener("canplay", onCanPlay, { once: true });

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
      v.removeEventListener("loadeddata", onCanPlay);
      v.removeEventListener("canplay", onCanPlay);
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
    >
      <source src="/video/hero-leaves.mp4" type="video/mp4" />
      <source src="/video/cinnamon-closeup.webm" type="video/webm" />
    </video>
  );
}
