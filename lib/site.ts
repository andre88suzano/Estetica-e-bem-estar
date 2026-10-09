export const site = {
  name: "Penha Andreia",
  brand: "Estética & Bem-Estar",
  region: "Grande Vitória, ES",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5527992540574",
  instagram: "https://www.instagram.com/andreiamsuzano/",
  gaId: process.env.NEXT_PUBLIC_GA_ID ?? "G-0SWSLV6CF6",
  baseUrl:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000"),
};

export function whatsappLink(message: string) {
  const number = site.whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
