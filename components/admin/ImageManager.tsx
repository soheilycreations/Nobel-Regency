"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, X, Upload } from "lucide-react";
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
      onChange([...images, url]);
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

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {images.map((src, i) => (
          <div key={src + i} className="relative h-20 w-20 overflow-hidden rounded-lg border border-white/15">
            <Image src={src} alt={`Photo ${i + 1}`} fill className="object-cover" />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute right-1 top-1 rounded-full bg-charcoal-deep/80 p-0.5 text-white/80 hover:text-red-400"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-white/25 text-white/40 hover:border-gold/50 hover:text-gold">
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
