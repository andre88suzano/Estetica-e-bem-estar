export const site = {
  name: "Andreia Suzano",
  brand: "Estética & Bem-Estar",
  region: "Grande Vitória, ES",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5527992540574",
  instagram: "https://www.instagram.com/andreiamsuzano/",
  instagramHandle: "@andreiamsuzano",
  gaId: process.env.NEXT_PUBLIC_GA_ID ?? "G-0SWSLV6CF6",
  baseUrl:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000"),
};

/**
 * Pending-content notes are shown in local development and Vercel preview
 * deployments only, never in production. Set NEXT_PUBLIC_SHOW_PENDING=1 or 0
 * to force either way.
 */
export const showPending =
  process.env.NEXT_PUBLIC_SHOW_PENDING !== undefined
    ? process.env.NEXT_PUBLIC_SHOW_PENDING === "1"
    : process.env.VERCEL_ENV === "preview" || process.env.NODE_ENV === "development";

export function whatsappLink(message: string) {
  const number = site.whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/** Formats a Brazilian number such as 5527992540574 as +55 27 99254-0574. */
export function formatPhone(digits: string) {
  const d = digits.replace(/\D/g, "");
  const match = d.match(/^(55)(\d{2})(\d{4,5})(\d{4})$/);
  return match ? `+${match[1]} ${match[2]} ${match[3]}-${match[4]}` : `+${d}`;
}
