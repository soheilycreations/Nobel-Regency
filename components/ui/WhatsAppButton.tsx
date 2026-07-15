"use client";

import { motion } from "framer-motion";
import { HOTEL } from "@/lib/rooms-data";

export default function WhatsAppButton() {
  const message = encodeURIComponent(
    "Hi Nobel Regency Hotel, I'd like to enquire about a stay."
  );
  const href = `https://wa.me/${HOTEL.whatsappNumber}?text=${message}`;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.08 }}
      className="fixed bottom-6 right-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-medium text-charcoal-deep shadow-lg shadow-black/30 md:bottom-8 md:right-8"
      aria-label="Message Nobel Regency Hotel Bibile on WhatsApp"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.39a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.95 6.45 17.5 2 12.04 2zm5.8 14.15c-.24.68-1.4 1.32-1.93 1.4-.5.08-1.12.11-1.8-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.8-4.16-4.94-4.35-.14-.19-1.18-1.57-1.18-2.99 0-1.42.75-2.12 1.02-2.41.27-.29.58-.36.78-.36.19 0 .39 0 .56.01.18.01.42-.07.66.5.24.58.82 2 .89 2.14.07.15.12.32.02.51-.1.19-.15.31-.29.48-.15.17-.31.38-.44.5-.15.15-.3.31-.13.6.17.29.75 1.24 1.62 2.01 1.11.99 2.05 1.3 2.34 1.44.29.15.46.13.64-.08.19-.2.79-.92 1-1.23.2-.31.41-.26.68-.16.28.1 1.76.83 2.06.98.29.15.49.23.56.36.07.13.07.75-.17 1.43z" />
      </svg>
      Direct Inquiry
    </motion.a>
  );
}
