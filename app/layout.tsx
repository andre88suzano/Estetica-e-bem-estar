import type { Metadata, Viewport } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import Script from "next/script";
import { site } from "@/lib/site";
import "./globals.css";

const serif = Playfair_Display({ subsets: ["latin"], style: ["normal", "italic"], weight: ["400", "500"], variable: "--font-serif", display: "swap" });
const sans = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-sans", display: "swap" });

const title = "Andreia Suzano | Estética & Bem-Estar na Grande Vitória";
const description = "Atendimento estético domiciliar na Grande Vitória (ES): pós-operatório, tratamentos faciais, drenagem linfática e massagens. Mais de 30 anos de experiência. Converse pelo WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL(site.baseUrl),
  title,
  description,
  alternates: { canonical: "/" },
  formatDetection: { telephone: false },
  applicationName: "Andreia Suzano — Estética & Bem-Estar",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Andreia Suzano — Estética & Bem-Estar",
    title,
    description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f7f4ec",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: `${site.name} — ${site.brand}`,
    areaServed: { "@type": "AdministrativeArea", name: site.region },
    description,
    url: site.baseUrl,
    image: `${site.baseUrl}/opengraph-image.jpg`,
    serviceType: ["Atendimento estético domiciliar", "Pós-operatório", "Tratamentos faciais", "Drenagem linfática", "Massagens terapêuticas", "Massagem com pedras quentes"],
    telephone: `+${site.whatsappNumber}`,
    sameAs: [site.instagram],
  };

  return (
    <html lang="pt-BR" className={`${serif.variable} ${sans.variable}`}>
      <body>
        {children}
        <Script id="local-business-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {site.gaId && (
          <>
            <Script id="google-analytics-bootstrap" strategy="beforeInteractive">
              {`window.dataLayer = window.dataLayer || []; window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};`}
            </Script>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${site.gaId}`} strategy="afterInteractive" />
            <Script id="google-analytics-config" strategy="afterInteractive">
              {`window.gtag('js', new Date()); window.gtag('config', '${site.gaId}', { send_page_view: false });`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
