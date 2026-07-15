"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import type { BookingRequest } from "@/types";

declare global {
  interface Window {
    paypal?: any;
  }
}

export default function PayPalButton({
  booking,
  onSuccess,
  onError,
}: {
  booking: BookingRequest;
  onSuccess: () => void;
  onError: (message: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  useEffect(() => {
    if (!clientId) {
      setLoadError("PayPal isn't configured yet (missing NEXT_PUBLIC_PAYPAL_CLIENT_ID).");
      return;
    }
    if (window.paypal) {
      setSdkReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture`;
    script.async = true;
    script.onload = () => setSdkReady(true);
    script.onerror = () => setLoadError("Could not load PayPal.");
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [clientId]);

  useEffect(() => {
    if (!sdkReady || !containerRef.current || !window.paypal) return;
    containerRef.current.innerHTML = "";

    window.paypal
      .Buttons({
        style: { layout: "vertical", color: "gold", shape: "pill", label: "pay" },
        createOrder: async () => {
          const res = await fetch("/api/paypal/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              roomSlug: booking.roomSlug,
              checkIn: booking.checkIn,
              checkOut: booking.checkOut,
              acRequested: booking.acRequested,
            }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Could not start payment");
          return data.orderId;
        },
        onApprove: async (data: { orderID: string }) => {
          const res = await fetch("/api/paypal/capture-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: data.orderID, booking }),
          });
          const result = await res.json();
          if (!res.ok) {
            onError(result.error || "Payment could not be confirmed");
            return;
          }
          onSuccess();
        },
        onError: () => onError("Something went wrong with PayPal. Please try again."),
      })
      .render(containerRef.current);
  }, [sdkReady, booking, onSuccess, onError]);

  if (loadError) return <p className="text-xs text-red-400">{loadError}</p>;
  if (!sdkReady) return <Loader2 size={18} className="mx-auto animate-spin text-gold" />;

  return <div ref={containerRef} />;
}
