// components/SmartImage.tsx
"use client";

import Image from "next/image";
import type { ImageProps } from "next/image";
import { useState } from "react";

type Props = Omit<ImageProps, "onError"> & {
  fallbackSrc?: string;
};

export default function SmartImage({
  src,
  alt,
  className,
  fallbackSrc = "/images/placeholder.jpg",
  ...rest
}: Props) {
  const [currentSrc, setCurrentSrc] = useState(src);

  return (
    <Image
      src={currentSrc}
      alt={alt}
      className={className}
      onError={() => setCurrentSrc(fallbackSrc)}
      {...rest}
    />
  );
}
