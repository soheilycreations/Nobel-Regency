"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ fallbackHref = "/" }: { fallbackHref?: string }) {
  const router = useRouter();

  const handleBack = () => {
    // If the user navigated here from elsewhere on the site, go back to
    // exactly where they came from. If they landed directly (e.g. from a
    // shared link or search result), there's no history to go back to, so
    // fall back to a sensible parent page instead of doing nothing.
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <button
      onClick={handleBack}
      className="mb-6 flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-gold"
    >
      <ArrowLeft size={16} /> Back
    </button>
  );
}
