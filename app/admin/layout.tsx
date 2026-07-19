"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, LayoutDashboard, BedDouble, Compass, MapPin, Images, CalendarCheck, LogOut, Menu, X } from "lucide-react";
import { supabase, getSession, signOutAdmin } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/rooms", label: "Rooms", icon: BedDouble },
  { href: "/admin/tours", label: "Tours", icon: Compass },
  { href: "/admin/locations", label: "Locations", icon: MapPin },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<Session | null | "loading">("loading");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) return;
    getSession().then((s) => {
      setSession(s);
      if (!s) router.replace("/admin/login");
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (!s) router.replace("/admin/login");
    });
    return () => sub.subscription.unsubscribe();
  }, [isLoginPage, router]);

  if (isLoginPage) return <>{children}</>;

  if (session === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={28} />
      </main>
    );
  }

  if (!session) return null; // redirecting

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-white/10 bg-charcoal-soft px-5 py-4 md:hidden">
        <p className="font-serif text-lg text-white">
          Nobel <span className="text-gold">Admin</span>
        </p>
        <button
          onClick={() => setMobileNavOpen((v) => !v)}
          className="text-white/70"
          aria-label="Toggle admin menu"
        >
          {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {mobileNavOpen && (
        <nav className="flex flex-col border-b border-white/10 bg-charcoal-soft px-3 pb-3 md:hidden">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileNavOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                  active ? "bg-gold/10 text-gold" : "text-white/60"
                }`}
              >
                <Icon size={16} /> {item.label}
              </Link>
            );
          })}
          <button
            onClick={() => signOutAdmin().then(() => router.replace("/admin/login"))}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/50"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </nav>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden w-56 flex-col border-r border-white/10 bg-charcoal-soft p-5 md:flex">
        <p className="mb-8 font-serif text-lg text-white">
          Nobel <span className="text-gold">Admin</span>
        </p>
        <nav className="flex flex-1 flex-col gap-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active ? "bg-gold/10 text-gold" : "text-white/60 hover:text-white"
                }`}
              >
                <Icon size={16} /> {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={() => signOutAdmin().then(() => router.replace("/admin/login"))}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/50 hover:text-white"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </aside>

      <main className="flex-1 bg-charcoal px-5 py-8 md:px-10">{children}</main>
    </div>
  );
}
