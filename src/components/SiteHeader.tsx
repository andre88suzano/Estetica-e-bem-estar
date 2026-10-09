"use client";

import { useState } from "react";
import { site, whatsappLink } from "@/lib/site";
import { TrackedLink } from "@/components/TrackedLink";

const links = [
  ["O cuidado", "#cuidado"],
  ["Tratamentos", "#tratamentos"],
  ["Trajetória", "#trajetoria"],
  ["Contato", "#contato"],
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <a className="brand" href="#inicio" aria-label={`${site.name} — início`} onClick={() => setOpen(false)}>
        <span className="brand__name">Penha Andreia</span>
        <span className="brand__descriptor">ESTÉTICA <i>&</i> BEM-ESTAR</span>
      </a>
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="primary-navigation"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        onClick={() => setOpen(!open)}
      >
        <span /><span />
      </button>
      <nav id="primary-navigation" className={`navigation${open ? " navigation--open" : ""}`} aria-label="Navegação principal" onKeyDown={(event) => { if (event.key === "Escape") setOpen(false); }}>
        {links.map(([label, href]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>
        ))}
        <TrackedLink className="header-cta" href={whatsappLink("Olá, Penha! Gostaria de saber sobre os atendimentos domiciliares.")} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
          Conversar <span aria-hidden="true">↗</span>
        </TrackedLink>
      </nav>
    </header>
  );
}
