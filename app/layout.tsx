import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { site } from "@/lib/site";
import "./globals.css";

const description = "Estética e bem-estar com atendimento domiciliar na Grande Vitória. Conheça o cuidado profissional de Penha Andreia e converse sobre seu atendimento.";

export const metadata: Metadata = {
  metadataBase: new URL(site.baseUrl),
  title: "Penha Andreia | Estética & Bem-Estar na Grande Vitória",
  description,
  applicationName: "Penha Andreia — Estética & Bem-Estar",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Penha Andreia — Estética & Bem-Estar",
    title: "Penha Andreia | Estética & Bem-Estar na Grande Vitória",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Penha Andreia | Estética & Bem-Estar na Grande Vitória",
    description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f7f6f0",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: `${site.name} — ${site.brand}`,
    areaServed: { "@type": "AdministrativeArea", name: site.region },
    serviceType: ["Estética facial", "Massagens", "Atendimento estético domiciliar"],
    telephone: `+${site.whatsappNumber}`,
    sameAs: [site.instagram],
  };

  return (
    <html lang="pt-BR">
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
