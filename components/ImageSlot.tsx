"use client";

import { useState } from "react";

type ImageSlotProps = {
  src?: string;
  shape?: "rect" | "circle";
  placeholder?: string;
  alt?: string;
};

/**
 * React port of the design's <image-slot> web component.
 * Renders the image with object-fit cover, and falls back to a styled
 * placeholder box when no src is given or the image fails to load
 * (e.g. the local `assets/art-*.png` portraits that ship as placeholders).
 */
export default function ImageSlot({
  src,
  shape = "rect",
  placeholder = "",
  alt = "",
}: ImageSlotProps) {
  const [failed, setFailed] = useState(false);
  const style = shape === "circle" ? { borderRadius: "50%" } : undefined;

  return (
    <div className="image-slot" style={style}>
      {src && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} onError={() => setFailed(true)} />
      ) : (
        <div className="image-slot-ph">{placeholder}</div>
      )}
    </div>
  );
}
