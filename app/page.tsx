import { Suspense } from "react";
import Image from "next/image";
import penhaAndreia from "@/assets/penha-andreia.webp";
import { AmbientBackground } from "@/components/AmbientBackground";
import { PageViewTracker } from "@/components/PageViewTracker";
import { SiteHeader } from "@/components/SiteHeader";
import { TrackedLink } from "@/components/TrackedLink";
import { site, whatsappLink } from "@/lib/site";

const services = [
  { number: "01", name: "Tratamentos faciais", detail: "Limpeza de pele e cuidados faciais conduzidos com atenção às necessidades de cada pele.", note: "Facial" },
  { number: "02", name: "Drenagem linfática", detail: "Técnica manual realizada com cuidado e adaptada ao contexto e às necessidades de cada atendimento.", note: "Corporal" },
  { number: "03", name: "Massagens terapêuticas", detail: "Um atendimento individualizado para momentos de tensão e cuidado corporal.", note: "Bem-estar" },
  { number: "04", name: "Pedras quentes", detail: "Massagem com pedras aquecidas, realizada em um ritmo acolhedor e atento ao seu conforto.", note: "Bem-estar" },
];

const testimonials = [
  {
    quote: "Fiz drenagem pós-operatória com a Penha e foi incrível. Atenciosa, pontual e muito profissional. Minha recuperação foi muito mais tranquila.",
    name: "Carla Mendes",
    initials: "CM",
    service: "Pós-operatório · Grande Vitória",
  },
  {
    quote: "A limpeza de pele foi excelente! Ela cuida com tanto carinho e minha pele ficou maravilhosa. Super indico para todo mundo!",
    name: "Renata Lima",
    initials: "RL",
    service: "Limpeza de pele · Vitória",
  },
  {
    quote: "A massagem relaxante foi a melhor experiência! Vim direto para casa e dormi como há muito não dormia. Vou voltar sempre!",
    name: "Ana Torres",
    initials: "AT",
    service: "Massagem · Serra",
  },
];

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true" className="arrow">{diagonal ? "↗" : "→"}</span>;
}

export default function Home() {
  return (
    <>
      <Suspense fallback={null}><PageViewTracker /></Suspense>
      <SiteHeader />
      <main>
        <section className="hero" id="inicio" aria-labelledby="hero-title">
          <AmbientBackground intensity="strong" placement="top-right" />
          <div className="hero__grain" aria-hidden="true" />
          <div className="hero__content">
            <p className="eyebrow"><span className="eyebrow__line" /> PENHA ANDREIA · ESTÉTICA & BEM-ESTAR</p>
            <h1 id="hero-title">Cuidado que<br /><em>respeita o seu tempo.</em></h1>
            <p className="hero__intro">Estética e bem-estar conduzidos com experiência, escuta e atenção a cada pessoa — no conforto da sua casa.</p>
            <div className="hero__actions">
              <TrackedLink className="button button--dark" href={whatsappLink("Olá, Penha! Gostaria de conversar sobre um atendimento domiciliar.")} target="_blank" rel="noreferrer" eventLabel="hero_primary">Conversar com Penha <Arrow diagonal /></TrackedLink>
              <a className="text-link" href="#tratamentos">Conheça os tratamentos <Arrow /></a>
            </div>
            <div className="hero__trust"><strong>30+</strong><span>anos de experiência<br />em estética</span><i aria-hidden="true" /></div>
            <div className="hero__location"><span className="location-mark" aria-hidden="true">⌖</span> Atendimento domiciliar · {site.region}</div>
          </div>
          <div className="hero__portrait">
            <Image src={penhaAndreia} alt="Penha Andreia, profissional de estética e bem-estar" priority sizes="(max-width: 680px) 390px, (max-width: 900px) 39vw, 490px" />
            <div className="portrait-caption"><span>RETRATO DE PENHA ANDREIA</span><span>GRANDE VITÓRIA · ES</span></div>
          </div>
          <a className="hero__scroll" href="#cuidado" aria-label="Descer para conhecer o cuidado"><span /> ROLE PARA DESCOBRIR</a>
        </section>

        <section className="intro section-pad" id="cuidado">
          <div className="section-index">01 <span /> O CUIDADO</div>
          <div className="intro__grid">
            <h2>Uma experiência<br />construída com <em>escuta.</em></h2>
            <div className="intro__copy">
              <p>Há mais de 30 anos, Penha Andreia dedica sua trajetória à estética. Hoje, leva esse cuidado até você, com atendimento domiciliar na Grande Vitória.</p>
              <a className="text-link" href="#trajetoria">Conheça a trajetória <Arrow /></a>
            </div>
          </div>
          <div className="intro__rule" />
          <div className="intro__values">
            <p><span>01</span> Atenção individual</p><p><span>02</span> Cuidado no seu espaço</p><p><span>03</span> Experiência profissional</p>
          </div>
        </section>

        <section className="postop section-pad" id="pos-operatorio">
          <AmbientBackground intensity="soft" placement="bottom-left" />
          <div className="section-index section-index--light">02 <span /> CUIDADO ESPECIALIZADO</div>
          <div className="postop__grid">
            <div className="postop__heading">
              <p className="eyebrow eyebrow--light">PRESENÇA EM CADA ETAPA</p>
              <h2>Pós-operatório,<br /><em>com atenção e cuidado.</em></h2>
              <p className="postop__lead">Um acompanhamento individualizado no ambiente domiciliar, com respeito às orientações da equipe médica responsável.</p>
              <TrackedLink className="button button--light" href={whatsappLink("Olá, Penha! Gostaria de conversar sobre atendimento estético no pós-operatório.")} target="_blank" rel="noreferrer" eventLabel="postoperative">Conversar sobre atendimento <Arrow diagonal /></TrackedLink>
            </div>
            <div className="postop__details">
              <div className="detail-line"><span className="detail-line__number">01</span><div><h3>Escuta antes de tudo</h3><p>Entender o momento e as orientações recebidas ajuda a conduzir o atendimento com responsabilidade.</p></div></div>
              <div className="detail-line"><span className="detail-line__number">02</span><div><h3>Cuidado em casa</h3><p>O atendimento domiciliar oferece acolhimento e praticidade durante o período de recuperação.</p></div></div>
              <div className="detail-line"><span className="detail-line__number">03</span><div><h3>Cada caso é único</h3><p>Recursos e condutas são conversados individualmente. O atendimento respeita as orientações da equipe médica.</p></div></div>
              <p className="postop__disclaimer">A indicação e o momento de cada cuidado devem ser avaliados com a equipe de saúde responsável.</p>
            </div>
          </div>
        </section>

        <section className="services section-pad" id="tratamentos">
          <div className="section-index">03 <span /> TRATAMENTOS</div>
          <div className="services__header"><div><p className="eyebrow">CUIDADO COM INTENÇÃO</p><h2>Um cuidado para<br /><em>cada necessidade.</em></h2></div><p className="services__summary">Conheça as possibilidades e converse com Penha para entender o que faz sentido para você.</p></div>
          <div className="services__list">
            {services.map((service) => (
              <article className="service-row" key={service.number}>
                <span className="service-row__number">{service.number}</span>
                <div className="service-row__main"><h3>{service.name}</h3><p>{service.detail}</p></div>
                <span className="service-row__note">{service.note}</span>
                <TrackedLink className="service-row__link" href={whatsappLink(`Olá, Penha! Gostaria de saber mais sobre ${service.name.toLowerCase()}.`)} target="_blank" rel="noreferrer" aria-label={`Consultar sobre ${service.name}`} eventLabel={`service_${service.number}`}>Consultar <Arrow diagonal /></TrackedLink>
              </article>
            ))}
          </div>
        </section>

        <section className="story section-pad" id="trajetoria">
          <AmbientBackground intensity="soft" placement="top-right" />
          <div className="section-index">04 <span /> TRAJETÓRIA</div>
          <div className="story__grid">
            <div className="story__note"><span className="story__place">São<br /><em>Paulo</em></span><span className="story__label">EXPERIÊNCIA PROFISSIONAL<br />NA ANNA PEGOVA</span><span className="story__rule" /><p>Uma etapa de sua trajetória na estética.</p></div>
            <div className="story__copy"><p className="eyebrow">EXPERIÊNCIA QUE ACOLHE</p><h2>Mais de três décadas<br />dedicadas à <em>estética.</em></h2><p>Ao longo de sua trajetória, Penha trabalhou na Anna Pegova, em São Paulo. É formada em Estética e Biomedicina e está cursando uma pós-graduação.</p><div className="timeline"><div><strong>+30 anos</strong><span>de experiência em estética</span></div><div><strong>São Paulo</strong><span>experiência na Anna Pegova</span></div><div><strong>Formação</strong><span>Estética e Biomedicina · pós-graduação em andamento</span></div></div></div>
          </div>
        </section>

        <section className="testimonials section-pad" id="depoimentos">
          <div className="section-index">05 <span /> RELATOS</div>
          <div className="testimonials__head">
            <div><p className="eyebrow">RELATOS PUBLICADOS</p><h2>O cuidado,<br /><em>pelas palavras de quem viveu.</em></h2></div>
            <p>Depoimentos já publicados no site da profissional.</p>
          </div>
          <div className="testimonials__grid">
            {testimonials.map((testimonial) => (
              <figure className="testimonial" key={testimonial.initials}>
                <span className="testimonial__rating" aria-label="5 de 5 estrelas">★★★★★</span>
                <blockquote>“{testimonial.quote}”</blockquote>
                <figcaption><span className="testimonial__initials" aria-hidden="true">{testimonial.initials}</span><span><strong>{testimonial.name}</strong><small>{testimonial.service}</small></span></figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="homecare section-pad" id="domiciliar">
          <div className="homecare__mark" aria-hidden="true"><span>⌖</span><i /></div>
          <div className="homecare__copy"><p className="eyebrow">NO SEU ESPAÇO, NO SEU TEMPO</p><h2>O cuidado vai<br /><em>até você.</em></h2><p>Penha atende em domicílio na Grande Vitória, Espírito Santo. Consulte pelo WhatsApp a disponibilidade para sua região e o melhor formato para o seu atendimento.</p><TrackedLink className="text-link" href={whatsappLink("Olá, Penha! Gostaria de consultar a disponibilidade de atendimento na minha região.")} target="_blank" rel="noreferrer" eventLabel="area_availability">Consultar disponibilidade <Arrow diagonal /></TrackedLink></div>
          <div className="homecare__region">GRANDE VITÓRIA<br /><span>ESPÍRITO SANTO</span></div>
        </section>

        <section className="contact section-pad" id="contato">
          <AmbientBackground intensity="medium" placement="top-right" />
          <p className="eyebrow eyebrow--light">UM PRIMEIRO PASSO</p><h2>Vamos conversar<br />sobre <em>o seu cuidado?</em></h2><p className="contact__intro">Conte a Penha o que você procura. Ela poderá orientar você sobre os atendimentos e a disponibilidade.</p>
          <TrackedLink className="button button--light contact__button" href={whatsappLink("Olá, Penha! Gostaria de conversar sobre um atendimento domiciliar na Grande Vitória.")} target="_blank" rel="noreferrer" eventLabel="final_contact">Iniciar conversa pelo WhatsApp <Arrow diagonal /></TrackedLink>
          <div className="contact__meta"><span>ATENDIMENTO DOMICILIAR</span><span>GRANDE VITÓRIA · ES</span></div>
        </section>
      </main>
      <footer className="footer">
        <a className="brand brand--footer" href="#inicio"><span className="brand__name">Penha Andreia</span><span className="brand__descriptor">ESTÉTICA <i>&</i> BEM-ESTAR</span></a>
        <div className="footer__links"><a href="#tratamentos">Tratamentos</a><a href="#trajetoria">Trajetória</a><a href="#contato">Contato</a><a href={site.instagram} target="_blank" rel="noreferrer">Instagram <Arrow diagonal /></a></div>
        <div className="footer__bottom"><span>Atendimento domiciliar · Grande Vitória, ES</span><span>© {new Date().getFullYear()} Penha Andreia</span></div>
      </footer>
    </>
  );
}
