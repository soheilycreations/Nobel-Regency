"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, X, Upload, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { uploadPhoto } from "@/lib/supabase";

export default function ImageManager({
  images,
  onChange,
  folder,
}: {
  images: string[];
  onChange: (images: string[]) => void;
  folder: "rooms" | "tours";
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadPhoto(file, folder);
      // New uploads go to the FRONT of the list, since the first image is
      // what's shown as the cover photo everywhere on the site. Without
      // this, a new upload just gets added to the end and the old cover
      // photo keeps showing, which looks like "nothing updated."
      onChange([url, ...images]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div>
      <p className="mb-2 text-xs text-white/40">
        The <span className="text-gold">first photo</span> is used as the cover image on the site. Use the arrows to reorder.
      </p>
      <div className="flex flex-wrap gap-3">
        {images.map((src, i) => (
          <div key={src + i} className="relative h-24 w-24 overflow-hidden rounded-lg border border-white/15">
            <Image src={src} alt={`Photo ${i + 1}`} fill className="object-cover" />
            {i === 0 && (
              <span className="absolute left-1 top-1 flex items-center gap-0.5 rounded bg-gold/90 px-1.5 py-0.5 text-[9px] font-semibold text-charcoal-deep">
                <Star size={9} fill="currentColor" /> Cover
              </span>
            )}
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute right-1 top-1 rounded-full bg-charcoal-deep/80 p-0.5 text-white/80 hover:text-red-400"
              aria-label="Remove photo"
            >
              <X size={12} />
            </button>
            <div className="absolute bottom-1 left-1 right-1 flex justify-between">
              <button
                type="button"
                onClick={() => moveImage(i, -1)}
                disabled={i === 0}
                className="rounded bg-charcoal-deep/80 p-0.5 text-white/80 hover:text-gold disabled:opacity-20"
                aria-label="Move earlier"
              >
                <ChevronLeft size={13} />
              </button>
              <button
                type="button"
                onClick={() => moveImage(i, 1)}
                disabled={i === images.length - 1}
                className="rounded bg-charcoal-deep/80 p-0.5 text-white/80 hover:text-gold disabled:opacity-20"
                aria-label="Move later"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        ))}

        <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-white/25 text-white/40 hover:border-gold/50 hover:text-gold">
          {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
          <span className="text-[10px]">Upload</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      <p className="mt-2 text-xs text-white/30">
        Uploads go to Supabase Storage (bucket: property-photos). Requires that bucket to exist — see README.
      </p>
    </div>
  );
}
