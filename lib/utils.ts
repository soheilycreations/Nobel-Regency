import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency: "LKR" | "USD" = "LKR") {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function nightsBetween(checkIn: string, checkOut: string) {
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  const ms = outDate.getTime() - inDate.getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}

// PayPal does not support LKR as a transaction currency, so any PayPal
// payment has to run in USD. This rate is a rough approximation (checked
// against the market rate in July 2026) — for real payments, replace this
// with a live FX rate lookup or a rate you set and update periodically.
// This is NOT precise enough to rely on for accounting.
const APPROX_LKR_PER_USD = 336;

export function lkrToUsd(amountLkr: number): number {
  return Math.round((amountLkr / APPROX_LKR_PER_USD) * 100) / 100;
}
