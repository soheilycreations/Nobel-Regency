"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Loader2, X } from "lucide-react";
import { getTours, upsertTour, deleteTour } from "@/lib/supabase";
import type { Tour } from "@/types";
import ImageManager from "@/components/admin/ImageManager";

const BLANK_TOUR: Tour = {
  slug: "",
  name: "",
  tagline: "",
  description: "",
  durationLabel: "",
  priceLabel: "Contact for pricing",
  images: [],
  highlights: [],
};

function duplicateSlugCount(tours: Tour[]): number {
  const counts = new Map<string, number>();
  for (const t of tours) counts.set(t.slug, (counts.get(t.slug) ?? 0) + 1);
  return [...counts.values()].filter((c) => c > 1).length;
}

export default function AdminToursPage() {
  const [tours, setTours] = useState<Tour[] | null>(null);
  const [editing, setEditing] = useState<Tour | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () => getTours().then(setTours);
  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    setError(null);
    try {
      await upsertTour(editing);
      setEditing(null);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Delete this tour? This cannot be undone.")) return;
    await deleteTour(slug);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-white">Tours</h1>
          <p className="mt-1 text-sm text-white/50">Manage tour experiences shown on the site.</p>
        </div>
        <button
          onClick={() => setEditing({ ...BLANK_TOUR })}
          className="gold-shimmer-btn flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-charcoal-deep"
        >
          <Plus size={16} /> Add Tour
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {!tours && <Loader2 className="animate-spin text-gold" size={24} />}
        {tours && duplicateSlugCount(tours) > 0 && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs text-red-300">
            Warning: {duplicateSlugCount(tours)} duplicate slug(s) found in the tours table — likely
            leftover rows from an earlier setup. This can cause edits to silently not show up on the
            site. Check with SQL: <code>select slug, count(*) from tours group by slug having count(*) &gt; 1;</code>
          </p>
        )}
        {tours?.map((tour) => (
          <div
            key={tour.id ?? tour.slug}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-charcoal-soft p-4"
          >
            <div className="flex items-center gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-charcoal">
                {tour.images[0] ? (
                  <Image src={tour.images[0]} alt={tour.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-[9px] text-white/30">No photo</div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{tour.name}</p>
                <p className="text-xs text-white/40">
                  {tour.durationLabel} · {tour.priceLabel}
                </p>
                <p className="text-[10px] text-white/25">slug: {tour.slug} · {tour.images.length} photo(s)</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(tour)}
                className="rounded-lg border border-white/15 p-2 text-white/60 hover:text-gold"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => handleDelete(tour.slug)}
                className="rounded-lg border border-white/15 p-2 text-white/60 hover:text-red-400"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-gold/20 bg-charcoal-soft p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-lg text-white">{editing.slug ? "Edit Tour" : "Add Tour"}</h2>
              <button onClick={() => setEditing(null)} className="text-white/50 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <Field label="Slug (URL, no spaces)">
                <input
                  value={editing.slug}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                  className="input"
                  placeholder="gal-oya-boat-safari"
                />
              </Field>
              <Field label="Name">
                <input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="input"
                />
              </Field>
              <Field label="Tagline">
                <input
                  value={editing.tagline}
                  onChange={(e) => setEditing({ ...editing, tagline: e.target.value })}
                  className="input"
                />
              </Field>
              <Field label="Description">
                <textarea
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="input"
                  rows={4}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Duration">
                  <input
                    value={editing.durationLabel}
                    onChange={(e) => setEditing({ ...editing, durationLabel: e.target.value })}
                    className="input"
                    placeholder="Half day"
                  />
                </Field>
                <Field label="Price label">
                  <input
                    value={editing.priceLabel}
                    onChange={(e) => setEditing({ ...editing, priceLabel: e.target.value })}
                    className="input"
                    placeholder="From USD 40 per person"
                  />
                </Field>
              </div>
              <Field label="Highlights (comma-separated)">
                <input
                  value={editing.highlights.join(", ")}
                  onChange={(e) =>
                    setEditing({ ...editing, highlights: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })
                  }
                  className="input"
                />
              </Field>
              <Field label="Photos">
                <ImageManager
                  images={editing.images}
                  onChange={(images) => setEditing({ ...editing, images })}
                  folder="tours"
                />
              </Field>
              <label className="flex items-center gap-2 text-sm text-white/70">
                <input
                  type="checkbox"
                  checked={editing.featured ?? false}
                  onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                  className="accent-gold"
                />
                Featured on homepage
              </label>
            </div>

            {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setEditing(null)}
                className="flex-1 rounded-xl border border-white/20 py-3 text-sm text-white/70"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !editing.slug || !editing.name}
                className="gold-shimmer-btn flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-charcoal-deep disabled:opacity-50"
              >
                {saving && <Loader2 size={16} className="animate-spin" />}
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: #1a1a1a;
          padding: 0.65rem 0.9rem;
          font-size: 0.875rem;
          color: white;
        }
        .input:focus {
          outline: none;
          border-color: #d4af37;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs uppercase tracking-wider text-white/50">{label}</label>
      {children}
    </div>
  );
}
