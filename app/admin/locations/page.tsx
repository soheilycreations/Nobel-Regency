"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Loader2, X } from "lucide-react";
import { getLocations, upsertLocation, deleteLocation } from "@/lib/supabase";
import type { Location } from "@/types";
import ImageManager from "@/components/admin/ImageManager";

const BLANK_LOCATION: Location = {
  slug: "",
  name: "",
  tagline: "",
  description: "",
  distanceLabel: "",
  images: [],
  highlights: [],
};

function duplicateSlugCount(locations: Location[]): number {
  const counts = new Map<string, number>();
  for (const l of locations) counts.set(l.slug, (counts.get(l.slug) ?? 0) + 1);
  return [...counts.values()].filter((c) => c > 1).length;
}

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState<Location[] | null>(null);
  const [editing, setEditing] = useState<Location | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () => getLocations().then(setLocations);
  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    setError(null);
    try {
      await upsertLocation(editing);
      setEditing(null);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Delete this location? This cannot be undone.")) return;
    await deleteLocation(slug);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-white">Locations</h1>
          <p className="mt-1 text-sm text-white/50">Manage nearby places shown on the site — good for SEO too.</p>
        </div>
        <button
          onClick={() => setEditing({ ...BLANK_LOCATION })}
          className="gold-shimmer-btn flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-charcoal-deep"
        >
          <Plus size={16} /> Add Location
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {!locations && <Loader2 className="animate-spin text-gold" size={24} />}
        {locations && duplicateSlugCount(locations) > 0 && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs text-red-300">
            Warning: {duplicateSlugCount(locations)} duplicate slug(s) found in the locations table —
            likely leftover rows from an earlier setup. Check with SQL:{" "}
            <code>select slug, count(*) from locations group by slug having count(*) &gt; 1;</code>
          </p>
        )}
        {locations?.map((location) => (
          <div
            key={location.id ?? location.slug}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-charcoal-soft p-4"
          >
            <div className="flex items-center gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-charcoal">
                {location.images[0] ? (
                  <Image src={location.images[0]} alt={location.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-[9px] text-white/30">No photo</div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{location.name}</p>
                <p className="text-xs text-white/40">{location.distanceLabel}</p>
                <p className="text-[10px] text-white/25">slug: {location.slug} · {location.images.length} photo(s)</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(location)}
                className="rounded-lg border border-white/15 p-2 text-white/60 hover:text-gold"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => handleDelete(location.slug)}
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
              <h2 className="font-serif text-lg text-white">{editing.id ? "Edit Location" : "Add Location"}</h2>
              <button onClick={() => setEditing(null)} className="text-white/50 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <Field label="Slug (URL, no spaces)">
                <input
                  value={editing.slug}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                  className="input disabled:opacity-40"
                  placeholder="maduru-oya-national-park"
                  disabled={Boolean(editing.id)}
                />
                {editing.id && (
                  <p className="mt-1 text-[10px] text-white/30">
                    Locked after creation — changing this would create a duplicate location instead of
                    updating this one.
                  </p>
                )}
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
              <Field label="Distance label">
                <input
                  value={editing.distanceLabel}
                  onChange={(e) => setEditing({ ...editing, distanceLabel: e.target.value })}
                  className="input"
                  placeholder="46 km from the hotel"
                />
              </Field>
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
                  folder="locations"
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
