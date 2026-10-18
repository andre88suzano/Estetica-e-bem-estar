"use client";

import { useEffect, useState } from "react";
import { site, whatsappLink } from "@/lib/site";
import { TrackedLink } from "@/components/TrackedLink";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

const links = [
  ["Tratamentos", "#tratamentos"],
  ["Pós-operatório", "#pos-operatorio"],
  ["Sobre", "#sobre"],
  ["Como funciona", "#como-funciona"],
  ["Dúvidas", "#duvidas"],
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="brand" href="#inicio" aria-label={`${site.name}, ${site.brand}: início`} onClick={() => setOpen(false)}>
          <span className="brand__name">Andreia Suzano</span>
          <span className="brand__descriptor">Estética &amp; Bem-Estar</span>
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="primary-navigation"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen(!open)}
        >
          <span aria-hidden="true" /><span aria-hidden="true" />
        </button>
        <nav id="primary-navigation" className={`navigation${open ? " navigation--open" : ""}`} aria-label="Navegação principal">
          {links.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>
          ))}
          <TrackedLink
            className="button button--primary button--small"
            href={whatsappLink("Olá, Andreia! Gostaria de saber sobre os atendimentos domiciliares.")}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
          >
            <WhatsAppIcon /> WhatsApp
          </TrackedLink>
        </nav>
      </div>
    </header>
  );
}
