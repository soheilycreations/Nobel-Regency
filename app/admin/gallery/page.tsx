"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Trash2, Upload, Save } from "lucide-react";
import { getGalleryPhotos, upsertGalleryPhoto, deleteGalleryPhoto, uploadPhoto } from "@/lib/supabase";
import type { GalleryPhoto } from "@/types";

export default function AdminGalleryPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[] | null>(null);
  const [uploading, setUploading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = () => getGalleryPhotos().then(setPhotos);
  useEffect(() => {
    load();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadPhoto(file, "gallery");
      const nextOrder = (photos?.length ?? 0);
      await upsertGalleryPhoto({ imageUrl: url, caption: "", sortOrder: nextOrder });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const updateCaption = (id: string, caption: string) => {
    setPhotos((prev) => prev?.map((p) => (p.id === id ? { ...p, caption } : p)) ?? null);
  };

  const saveCaption = async (photo: GalleryPhoto) => {
    if (!photo.id) return;
    setSavingId(photo.id);
    try {
      await upsertGalleryPhoto(photo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this photo? This cannot be undone.")) return;
    await deleteGalleryPhoto(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-white">Homepage Gallery</h1>
          <p className="mt-1 text-sm text-white/50">
            Photos shown in the &ldquo;Straight From the Garden&rdquo; section on the homepage.
          </p>
        </div>
        <label className="gold-shimmer-btn flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-charcoal-deep">
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          Add Photo
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {!photos && <Loader2 className="animate-spin text-gold" size={24} />}
        {photos?.map((photo) => (
          <div key={photo.id} className="rounded-xl border border-white/10 bg-charcoal-soft p-3">
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-charcoal">
              <Image src={photo.imageUrl} alt={photo.caption || "Gallery photo"} fill className="object-cover" />
            </div>
            <input
              value={photo.caption}
              onChange={(e) => updateCaption(photo.id!, e.target.value)}
              placeholder="Caption (optional)"
              className="mt-2 w-full rounded-lg border border-white/15 bg-charcoal px-2.5 py-1.5 text-xs text-white focus:border-gold focus:outline-none"
            />
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => saveCaption(photo)}
                disabled={savingId === photo.id}
                className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-white/15 py-1.5 text-xs text-white/60 hover:text-gold"
              >
                {savingId === photo.id ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                Save
              </button>
              <button
                onClick={() => handleDelete(photo.id!)}
                className="rounded-lg border border-white/15 p-1.5 text-white/60 hover:text-red-400"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
