"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    grecaptcha?: {
      render: (container: HTMLElement, params: Record<string, unknown>) => number;
      reset: (id?: number) => void;
    };
    onRecaptchaLoad?: () => void;
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";

export default function Recaptcha({ onChange }: { onChange: (token: string | null) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<number | null>(null);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    if (!SITE_KEY) return; // Not configured — component just won't render a widget.

    if (window.grecaptcha) {
      setScriptReady(true);
      return;
    }

    window.onRecaptchaLoad = () => setScriptReady(true);
    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!scriptReady || !containerRef.current || !window.grecaptcha || widgetId.current !== null) return;
    widgetId.current = window.grecaptcha.render(containerRef.current, {
      sitekey: SITE_KEY,
      callback: (token: string) => onChange(token),
      "expired-callback": () => onChange(null),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptReady]);

  if (!SITE_KEY) {
    // Not configured yet — fail open rather than blocking every booking.
    // See .env.example / README for setup steps.
    return (
      <p className="text-xs text-white/25">
        (Spam check not configured — see NEXT_PUBLIC_RECAPTCHA_SITE_KEY in README)
      </p>
    );
  }

  return <div ref={containerRef} />;
}
