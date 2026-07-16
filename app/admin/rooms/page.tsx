"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Loader2, X } from "lucide-react";
import { getRooms, upsertRoom, deleteRoom } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
import type { Room } from "@/types";
import ImageManager from "@/components/admin/ImageManager";

const BLANK_ROOM: Room = {
  slug: "",
  name: "",
  location: "",
  tagline: "",
  description: "",
  pricePerNight: 0,
  hasACOption: false,
  currency: "LKR",
  maxGuests: 2,
  bedType: "",
  totalUnits: 1,
  images: [],
  amenities: [],
};

function duplicateSlugCount(rooms: Room[]): number {
  const counts = new Map<string, number>();
  for (const r of rooms) counts.set(r.slug, (counts.get(r.slug) ?? 0) + 1);
  return [...counts.values()].filter((c) => c > 1).length;
}

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[] | null>(null);
  const [editing, setEditing] = useState<Room | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () => getRooms().then(setRooms);
  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    setError(null);
    try {
      await upsertRoom(editing);
      setEditing(null);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Delete this room? This cannot be undone.")) return;
    await deleteRoom(slug);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-white">Rooms</h1>
          <p className="mt-1 text-sm text-white/50">Manage room types, pricing, and photos.</p>
        </div>
        <button
          onClick={() => setEditing({ ...BLANK_ROOM })}
          className="gold-shimmer-btn flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-charcoal-deep"
        >
          <Plus size={16} /> Add Room
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {!rooms && <Loader2 className="animate-spin text-gold" size={24} />}
        {rooms && duplicateSlugCount(rooms) > 0 && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs text-red-300">
            Warning: {duplicateSlugCount(rooms)} duplicate slug(s) found in the rooms table — likely
            leftover rows from an earlier setup. This can cause edits to silently not show up on the
            site. Check with SQL: <code>select slug, count(*) from rooms group by slug having count(*) &gt; 1;</code>
          </p>
        )}
        {rooms?.map((room) => (
          <div
            key={room.id ?? room.slug}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-charcoal-soft p-4"
          >
            <div className="flex items-center gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-charcoal">
                {room.images[0] ? (
                  <Image src={room.images[0]} alt={room.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-[9px] text-white/30">No photo</div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{room.name}</p>
                <p className="text-xs text-white/40">
                  {room.location} · {formatPrice(room.pricePerNight, room.currency)}/night · {room.totalUnits} unit(s)
                </p>
                <p className="text-[10px] text-white/25">slug: {room.slug} · {room.images.length} photo(s)</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(room)}
                className="rounded-lg border border-white/15 p-2 text-white/60 hover:text-gold"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => handleDelete(room.slug)}
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
              <h2 className="font-serif text-lg text-white">{editing.slug ? "Edit Room" : "Add Room"}</h2>
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
                  placeholder="double-room-garden-view"
                />
              </Field>
              <Field label="Name">
                <input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="input"
                />
              </Field>
              <Field label="Location">
                <input
                  value={editing.location}
                  onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                  className="input"
                  placeholder="Main Bungalow"
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
                  rows={3}
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Price per night (LKR)">
                  <input
                    type="number"
                    value={editing.pricePerNight}
                    onChange={(e) => setEditing({ ...editing, pricePerNight: Number(e.target.value) })}
                    className="input"
                  />
                </Field>
                <Field label="Total units">
                  <input
                    type="number"
                    value={editing.totalUnits}
                    onChange={(e) => setEditing({ ...editing, totalUnits: Number(e.target.value) })}
                    className="input"
                  />
                </Field>
                <Field label="Max guests">
                  <input
                    type="number"
                    value={editing.maxGuests}
                    onChange={(e) => setEditing({ ...editing, maxGuests: Number(e.target.value) })}
                    className="input"
                  />
                </Field>
                <Field label="Size (m², optional)">
                  <input
                    type="number"
                    value={editing.sizeSqm ?? ""}
                    onChange={(e) =>
                      setEditing({ ...editing, sizeSqm: e.target.value ? Number(e.target.value) : undefined })
                    }
                    className="input"
                  />
                </Field>
              </div>

              <Field label="Bed type">
                <input
                  value={editing.bedType}
                  onChange={(e) => setEditing({ ...editing, bedType: e.target.value })}
                  className="input"
                  placeholder="1 Bed"
                />
              </Field>

              <label className="flex items-center gap-2 text-sm text-white/70">
                <input
                  type="checkbox"
                  checked={editing.hasACOption}
                  onChange={(e) => setEditing({ ...editing, hasACOption: e.target.checked })}
                  className="accent-gold"
                />
                Offer air conditioning as an add-on
              </label>

              {editing.hasACOption && (
                <Field label="AC surcharge per night (LKR)">
                  <input
                    type="number"
                    value={editing.acSurchargePerNight ?? ""}
                    onChange={(e) =>
                      setEditing({ ...editing, acSurchargePerNight: Number(e.target.value) })
                    }
                    className="input"
                  />
                </Field>
              )}

              <Field label="Amenities (comma-separated)">
                <input
                  value={editing.amenities.join(", ")}
                  onChange={(e) =>
                    setEditing({ ...editing, amenities: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })
                  }
                  className="input"
                />
              </Field>

              <Field label="Photos">
                <ImageManager
                  images={editing.images}
                  onChange={(images) => setEditing({ ...editing, images })}
                  folder="rooms"
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
