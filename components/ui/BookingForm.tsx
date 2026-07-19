"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import PayPalButton from "@/components/ui/PayPalButton";
import Recaptcha from "@/components/ui/Recaptcha";
import { ROOMS as SEED_ROOMS } from "@/lib/rooms-data";
import { guestDetailsSchema, type GuestDetailsForm } from "@/lib/schemas";
import { checkAvailability, getRooms } from "@/lib/supabase";
import { formatPrice, nightsBetween, lkrToUsd } from "@/lib/utils";

const STEPS = ["Dates & Room", "Guest Details", "Confirm & Pay"] as const;
const RECAPTCHA_CONFIGURED = Boolean(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY);

export default function BookingForm() {
  const params = useSearchParams();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const roomsQuery = useQuery({ queryKey: ["rooms"], queryFn: getRooms, initialData: SEED_ROOMS });
  const ROOMS = roomsQuery.data;
  const [roomSlug, setRoomSlug] = useState(params.get("room") ?? ROOMS[0].slug);
  const [checkIn, setCheckIn] = useState<Date | null>(
    params.get("checkIn") ? new Date(params.get("checkIn")!) : null
  );
  const [checkOut, setCheckOut] = useState<Date | null>(
    params.get("checkOut") ? new Date(params.get("checkOut")!) : null
  );
  const [guests, setGuests] = useState(Number(params.get("guests") ?? 2));
  const [acRequested, setAcRequested] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"later" | "paypal">("later");
  const [paypalError, setPaypalError] = useState<string | null>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const room = useMemo(() => ROOMS.find((r) => r.slug === roomSlug) ?? ROOMS[0], [roomSlug]);
  const nights = checkIn && checkOut ? nightsBetween(checkIn.toISOString(), checkOut.toISOString()) : 0;
  const nightlyRate = room.pricePerNight + (acRequested && room.acSurchargePerNight ? room.acSurchargePerNight : 0);
  const total = nights * nightlyRate;

  const availabilityQuery = useQuery({
    queryKey: ["availability", roomSlug, checkIn, checkOut],
    queryFn: () =>
      checkAvailability(roomSlug, checkIn!.toISOString().slice(0, 10), checkOut!.toISOString().slice(0, 10)),
    enabled: Boolean(checkIn && checkOut),
    retry: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<GuestDetailsForm>({ resolver: zodResolver(guestDetailsSchema) });

  const bookingMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/create-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recaptchaToken,
          roomSlug,
          checkIn: checkIn!.toISOString().slice(0, 10),
          checkOut: checkOut!.toISOString().slice(0, 10),
          guests,
          acRequested: room.hasACOption ? acRequested : false,
          ...getValues(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not create booking");
      return data.booking;
    },
    onSuccess: () => setConfirmed(true),
  });

  const canProceedStep0 = Boolean(checkIn && checkOut && checkIn < checkOut);

  if (confirmed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto max-w-lg rounded-2xl border border-gold/30 bg-charcoal-soft p-10 text-center"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold-gradient">
          <Check size={28} className="text-charcoal-deep" />
        </div>
        <h2 className="font-serif text-2xl text-white">Booking Request Received</h2>
        <p className="mt-3 text-sm text-white/60">
          Thank you, {getValues("fullName")}. We&rsquo;ve sent a confirmation to{" "}
          {getValues("email")} and our reservations team will be in touch on WhatsApp
          shortly to finalise payment.
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-6 rounded-full border border-gold/40 px-6 py-2.5 text-xs uppercase tracking-wider text-gold"
        >
          Back to Home
        </button>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Step indicator */}
      <div className="mb-10 flex items-center justify-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                i <= step ? "bg-gold-gradient text-charcoal-deep" : "border border-white/20 text-white/40"
              }`}
            >
              {i + 1}
            </div>
            <span className={`hidden text-xs sm:block ${i <= step ? "text-white" : "text-white/40"}`}>
              {label}
            </span>
            {i < STEPS.length - 1 && <div className="mx-2 h-px w-8 bg-white/15" />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5 rounded-2xl border border-white/10 bg-charcoal-soft p-6 md:p-8"
          >
            <div>
              <label className="mb-2 block text-xs uppercase tracking-wider text-white/50">Room</label>
              <select
                value={roomSlug}
                onChange={(e) => {
                  setRoomSlug(e.target.value);
                  setAcRequested(false);
                }}
                className="w-full rounded-lg border border-white/15 bg-charcoal px-4 py-3 text-sm text-white focus:border-gold focus:outline-none"
              >
                {ROOMS.map((r) => (
                  <option key={r.slug} value={r.slug}>
                    {r.name} ({r.location}) — {formatPrice(r.pricePerNight, r.currency)}/night
                  </option>
                ))}
              </select>
            </div>

            {room.hasACOption && (
              <label className="flex items-center justify-between rounded-lg border border-white/15 bg-charcoal px-4 py-3 text-sm text-white/80">
                <span>Add air conditioning</span>
                <span className="flex items-center gap-3">
                  <span className="text-xs text-gold">
                    +{formatPrice(room.acSurchargePerNight ?? 0, room.currency)}/night
                  </span>
                  <input
                    type="checkbox"
                    checked={acRequested}
                    onChange={(e) => setAcRequested(e.target.checked)}
                    className="h-4 w-4 accent-gold"
                  />
                </span>
              </label>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-wider text-white/50">Check-in</label>
                <DatePicker
                  selected={checkIn}
                  onChange={setCheckIn}
                  selectsStart
                  startDate={checkIn}
                  endDate={checkOut}
                  minDate={new Date()}
                  placeholderText="Select date"
                  className="w-full rounded-lg border border-white/15 bg-charcoal px-4 py-3 text-sm text-white focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-wider text-white/50">Check-out</label>
                <DatePicker
                  selected={checkOut}
                  onChange={setCheckOut}
                  selectsEnd
                  startDate={checkIn}
                  endDate={checkOut}
                  minDate={checkIn ?? new Date()}
                  placeholderText="Select date"
                  className="w-full rounded-lg border border-white/15 bg-charcoal px-4 py-3 text-sm text-white focus:border-gold focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-wider text-white/50">Guests</label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full rounded-lg border border-white/15 bg-charcoal px-4 py-3 text-sm text-white focus:border-gold focus:outline-none"
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>
                    {n} Guest{n > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>

            {checkIn && checkOut && (
              <div className="flex items-center justify-between rounded-lg bg-charcoal px-4 py-3 text-sm">
                <span className="text-white/60">
                  {nights} night{nights > 1 ? "s" : ""} · {formatPrice(nightlyRate, room.currency)}/night
                </span>
                <span className="font-semibold text-gold">{formatPrice(total, room.currency)}</span>
              </div>
            )}

            {availabilityQuery.data && !availabilityQuery.data.available && (
              <p className="text-sm text-red-400">
                This room isn&rsquo;t available for the selected dates. Please try different dates.
              </p>
            )}

            <button
              disabled={!canProceedStep0}
              onClick={() => setStep(1)}
              className="gold-shimmer-btn w-full rounded-xl py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-charcoal-deep disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continue
            </button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.form
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleSubmit(() => setStep(2))}
            className="space-y-5 rounded-2xl border border-white/10 bg-charcoal-soft p-6 md:p-8"
          >
            <div>
              <label className="mb-2 block text-xs uppercase tracking-wider text-white/50">Full Name</label>
              <input
                {...register("fullName")}
                className="w-full rounded-lg border border-white/15 bg-charcoal px-4 py-3 text-sm text-white focus:border-gold focus:outline-none"
                placeholder="Your full name"
              />
              {errors.fullName && <p className="mt-1 text-xs text-red-400">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-wider text-white/50">Email</label>
              <input
                {...register("email")}
                type="email"
                className="w-full rounded-lg border border-white/15 bg-charcoal px-4 py-3 text-sm text-white focus:border-gold focus:outline-none"
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-wider text-white/50">Phone</label>
              <input
                {...register("phone")}
                className="w-full rounded-lg border border-white/15 bg-charcoal px-4 py-3 text-sm text-white focus:border-gold focus:outline-none"
                placeholder="+94 7X XXX XXXX"
              />
              {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-wider text-white/50">
                Special Requests (optional)
              </label>
              <textarea
                {...register("specialRequests")}
                rows={3}
                className="w-full rounded-lg border border-white/15 bg-charcoal px-4 py-3 text-sm text-white focus:border-gold focus:outline-none"
                placeholder="Early check-in, celebration, dietary needs..."
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(0)}
                className="w-1/3 rounded-xl border border-white/20 py-3.5 text-sm uppercase tracking-wider text-white/70"
              >
                Back
              </button>
              <button
                type="submit"
                className="gold-shimmer-btn w-2/3 rounded-xl py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-charcoal-deep"
              >
                Continue
              </button>
            </div>
          </motion.form>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5 rounded-2xl border border-white/10 bg-charcoal-soft p-6 md:p-8"
          >
            <h3 className="font-serif text-xl text-white">Confirm Your Reservation</h3>
            <div className="space-y-2 rounded-lg bg-charcoal px-4 py-4 text-sm text-white/70">
              <p>{room.name} · {room.location}</p>
              <p>
                {checkIn?.toDateString()} → {checkOut?.toDateString()} · {nights} night{nights > 1 ? "s" : ""}
              </p>
              <p>{guests} guest(s){room.hasACOption ? ` · ${acRequested ? "With" : "Without"} air conditioning` : ""}</p>
              <p className="border-t border-white/10 pt-2 text-base font-semibold text-gold">
                Total: {formatPrice(total, room.currency)}
              </p>
            </div>

            <p className="text-xs leading-relaxed text-white/40">
              Choose how you'd like to handle payment.
            </p>

            <div className="flex gap-2 rounded-xl border border-white/10 bg-charcoal p-1">
              <button
                type="button"
                onClick={() => setPaymentMethod("later")}
                className={`flex-1 rounded-lg py-2 text-xs font-medium uppercase tracking-wider ${
                  paymentMethod === "later" ? "bg-gold text-charcoal-deep" : "text-white/50"
                }`}
              >
                Reserve, Pay Later
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("paypal")}
                className={`flex-1 rounded-lg py-2 text-xs font-medium uppercase tracking-wider ${
                  paymentMethod === "paypal" ? "bg-gold text-charcoal-deep" : "text-white/50"
                }`}
              >
                Pay Now (PayPal)
              </button>
            </div>

            {paymentMethod === "later" ? (
              <>
                <p className="text-xs leading-relaxed text-white/40">
                  Payment is securely processed after confirmation. Our team will send a
                  payment link (card or bank transfer) via email and WhatsApp — no card
                  details are collected on this page.
                </p>

                <Recaptcha onChange={setRecaptchaToken} />

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 rounded-xl border border-white/20 py-3.5 text-sm uppercase tracking-wider text-white/70"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => bookingMutation.mutate()}
                    disabled={bookingMutation.isPending || (RECAPTCHA_CONFIGURED && !recaptchaToken)}
                    className="gold-shimmer-btn flex w-2/3 items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-charcoal-deep disabled:opacity-60"
                  >
                    {bookingMutation.isPending && <Loader2 size={16} className="animate-spin" />}
                    Confirm Reservation
                  </button>
                </div>

                {bookingMutation.isError && (
                  <p className="text-sm text-red-400">
                    {bookingMutation.error instanceof Error
                      ? bookingMutation.error.message
                      : "Something went wrong sending your request. Please try again or reach us on WhatsApp."}
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="text-xs leading-relaxed text-white/40">
                  {room.currency === "USD" ? (
                    <>
                      You'll be charged <span className="text-gold">USD {total.toFixed(2)}</span> via
                      PayPal. Your reservation is confirmed automatically once payment goes through.
                    </>
                  ) : (
                    <>
                      PayPal doesn't support {room.currency}, so this charges approximately{" "}
                      <span className="text-gold">USD {lkrToUsd(total).toFixed(2)}</span> (today's rough
                      conversion) instead of the {room.currency} total above. Your reservation is
                      confirmed automatically once payment goes through.
                    </>
                  )}
                </p>
                <PayPalButton
                  booking={{
                    roomSlug,
                    checkIn: checkIn!.toISOString().slice(0, 10),
                    checkOut: checkOut!.toISOString().slice(0, 10),
                    guests,
                    acRequested: room.hasACOption ? acRequested : false,
                    ...getValues(),
                  }}
                  onSuccess={() => setConfirmed(true)}
                  onError={(msg) => setPaypalError(msg)}
                />
                {paypalError && <p className="text-sm text-red-400">{paypalError}</p>}
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full rounded-xl border border-white/20 py-3 text-sm uppercase tracking-wider text-white/70"
                >
                  Back
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
