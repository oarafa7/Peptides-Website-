"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  title,
}: {
  images: { url: string; altText: string | null }[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  const shown = images.length > 0 ? images : [{ url: "", altText: title }];

  return (
    <div className="flex flex-col gap-4 sm:flex-row-reverse">
      <div className="relative aspect-square flex-1 overflow-hidden rounded-xl bg-muted">
        {shown[active]?.url && (
          <Image
            src={shown[active].url}
            alt={shown[active].altText ?? title}
            fill
            priority
            sizes="(min-width: 1024px) 45vw, 90vw"
            className="object-cover"
          />
        )}
      </div>
      {shown.length > 1 && (
        <div className="flex gap-2 overflow-x-auto sm:flex-col sm:overflow-visible">
          {shown.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2",
                active === i ? "border-primary" : "border-transparent"
              )}
            >
              {img.url && (
                <Image src={img.url} alt={img.altText ?? title} fill sizes="64px" className="object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
