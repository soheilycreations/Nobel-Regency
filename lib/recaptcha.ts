// Server-only. Verifies a reCAPTCHA token with Google's siteverify endpoint.
// Never import this from a client component — it needs RECAPTCHA_SECRET_KEY,
// which must never reach the browser.
export async function verifyRecaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    // Not configured yet — fail open so the booking flow isn't blocked
    // before setup is complete. See README for setup steps.
    console.warn("RECAPTCHA_SECRET_KEY not set — skipping spam check.");
    return true;
  }
  if (!token) return false;

  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    });
    const data = await res.json();
    return data.success === true;
  } catch (err) {
    console.error("reCAPTCHA verification request failed:", err);
    return false;
  }
}
