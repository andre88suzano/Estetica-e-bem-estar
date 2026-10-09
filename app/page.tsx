import { Suspense } from "react";
import Image from "next/image";
import penhaAndreia from "@/assets/penha-andreia.webp";
import { PageViewTracker } from "@/components/PageViewTracker";
import { SiteHeader } from "@/components/SiteHeader";
import { TrackedLink } from "@/components/TrackedLink";
import AmbientBackground from "@/components/ambient/AmbientBackground";
import { site, whatsappLink } from "@/lib/site";

const services = [
  { number: "01", name: "Pós-operatório", detail: "Acompanhamento individualizado em diálogo com as orientações da equipe de saúde responsável.", note: "Cuidado especializado" },
  { number: "02", name: "Tratamentos faciais", detail: "Limpeza de pele e cuidados faciais conduzidos com atenção às necessidades de cada pele.", note: "Facial" },
  { number: "03", name: "Drenagem linfática", detail: "Técnica manual realizada com cuidado e adaptada ao contexto e às necessidades de cada atendimento.", note: "Corporal" },
  { number: "04", name: "Massagens terapêuticas", detail: "Um atendimento individualizado para momentos de tensão e cuidado corporal.", note: "Bem-estar" },
  { number: "05", name: "Pedras quentes", detail: "Massagem com pedras aquecidas, realizada em um ritmo acolhedor e atento ao seu conforto.", note: "Bem-estar" },
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
          <AmbientBackground
            className="hero__atmosphere"
            preset="minimal"
            parallax={false}
            scroll={false}
            glowIntensity={0.045}
            glowBlur={76}
            noiseOpacity={0.018}
            config={{
              colors: {
                primary: "#C4A574",
                secondary: "#668675",
                soft: "#D5E0D5",
                light: "#668675",
              },
            }}
          />
          <div className="hero__content">
            <p className="eyebrow"><span className="eyebrow__line" /> ESTÉTICA & BEM-ESTAR · GRANDE VITÓRIA</p>
            <h1 id="hero-title">Seu cuidado,<br /><em>no seu espaço.</em></h1>
            <p className="hero__intro">Penha Andreia leva o atendimento estético até você, com mais de 30 anos de experiência e atenção a cada pessoa.</p>
            <div className="hero__actions">
              <TrackedLink className="button button--dark" href={whatsappLink("Olá, Penha! Gostaria de conversar sobre um atendimento domiciliar.")} target="_blank" rel="noreferrer" eventLabel="hero_primary">Conversar com Penha <Arrow diagonal /></TrackedLink>
              <a className="text-link" href="#tratamentos">Conheça os tratamentos <Arrow /></a>
            </div>
            <div className="hero__location"><span className="location-mark" aria-hidden="true" /> Atendimento domiciliar · {site.region}</div>
          </div>
          <div className="hero__portrait">
            <Image src={penhaAndreia} alt="Penha Andreia, profissional de estética e bem-estar" priority sizes="(max-width: 680px) 390px, (max-width: 900px) 39vw, 490px" />
            <span className="portrait-index" aria-hidden="true">P · A</span>
            <div className="portrait-caption"><span>RETRATO DE PENHA ANDREIA</span><span>GRANDE VITÓRIA · ES</span></div>
          </div>
          <a className="hero__scroll" href="#cuidado" aria-label="Descer para conhecer o cuidado"><span /> ROLE PARA DESCOBRIR</a>
        </section>

        <section className="postop section-pad" id="pos-operatorio">
          <div className="section-index section-index--light">01 <span /> CUIDADO ESPECIALIZADO</div>
          <div className="postop__grid">
            <div className="postop__heading" data-reveal>
              <p className="eyebrow eyebrow--light">PRESENÇA EM CADA ETAPA</p>
              <h2>Pós-operatório,<br /><em>com atenção e cuidado.</em></h2>
              <p className="postop__lead">Um acompanhamento individualizado no ambiente domiciliar, com respeito às orientações da equipe médica responsável.</p>
              <TrackedLink className="button button--light" href={whatsappLink("Olá, Penha! Gostaria de conversar sobre atendimento estético no pós-operatório.")} target="_blank" rel="noreferrer" eventLabel="postoperative">Conversar sobre atendimento <Arrow diagonal /></TrackedLink>
            </div>
            <div className="postop__details" data-reveal>
              <div className="detail-line"><span className="detail-line__number">01</span><div><h3>Escuta antes de tudo</h3><p>Entender o momento e as orientações recebidas ajuda a conduzir o atendimento com responsabilidade.</p></div></div>
              <div className="detail-line"><span className="detail-line__number">02</span><div><h3>Cuidado em casa</h3><p>O atendimento domiciliar oferece acolhimento e praticidade durante o período de recuperação.</p></div></div>
              <div className="detail-line"><span className="detail-line__number">03</span><div><h3>Cada caso é único</h3><p>Recursos e condutas são conversados individualmente. O atendimento respeita as orientações da equipe médica.</p></div></div>
              <p className="postop__disclaimer">A indicação e o momento de cada cuidado devem ser avaliados com a equipe de saúde responsável.</p>
            </div>
          </div>
        </section>

        <section className="intro section-pad" id="cuidado">
          <div className="section-index">02 <span /> O CUIDADO</div>
          <div className="intro__grid" data-reveal>
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

        <section className="services section-pad" id="tratamentos">
          <div className="section-index">03 <span /> TRATAMENTOS</div>
          <div className="services__header" data-reveal><div><p className="eyebrow">CUIDADO COM INTENÇÃO</p><h2>Um cuidado para<br /><em>cada necessidade.</em></h2></div><p className="services__summary">Conheça as possibilidades e converse com Penha para entender o que faz sentido para você.</p></div>
          <div className="services__list">
            {services.map((service) => (
              <article className={`service-row${service.number === "01" ? " service-row--featured" : ""}`} key={service.number} data-reveal>
                <span className="service-row__number">{service.number}</span>
                <div className="service-row__main"><h3>{service.name}</h3><p>{service.detail}</p></div>
                <span className="service-row__note">{service.note}</span>
                <TrackedLink className="service-row__link" href={whatsappLink(`Olá, Penha! Gostaria de saber mais sobre ${service.name.toLowerCase()}.`)} target="_blank" rel="noreferrer" aria-label={`Consultar sobre ${service.name}`} eventLabel={`service_${service.number}`}>Consultar <Arrow diagonal /></TrackedLink>
              </article>
            ))}
          </div>
        </section>

        <section className="story section-pad" id="trajetoria">
          <div className="section-index">04 <span /> TRAJETÓRIA</div>
          <div className="story__grid">
            <div className="story__note" data-reveal>
              <span className="story__overline">EXPERIÊNCIA PROFISSIONAL</span>
              <span className="story__place">São<br /><em>Paulo</em></span>
              <span className="story__label">NA ANNA PEGOVA</span>
              <span className="story__rule" />
              <p>Uma etapa de sua trajetória na estética.</p>
            </div>
            <div className="story__copy" data-reveal><p className="eyebrow">EXPERIÊNCIA QUE ACOLHE</p><h2>Mais de três décadas<br />dedicadas à <em>estética.</em></h2><p>Ao longo de sua trajetória, Penha trabalhou na Anna Pegova, em São Paulo. É formada em Estética e Biomedicina e está cursando uma pós-graduação.</p><div className="timeline"><div><strong>+30 anos</strong><span>de experiência em estética</span></div><div><strong>São Paulo</strong><span>experiência na Anna Pegova</span></div><div><strong>Formação</strong><span>Estética e Biomedicina · pós-graduação em andamento</span></div></div></div>
          </div>
        </section>

        <section className="start section-pad" id="conversa">
          <div className="section-index">05 <span /> COMO COMEÇAR</div>
          <div className="start__layout">
            <div className="start__heading" data-reveal><p className="eyebrow">UM ATENDIMENTO INDIVIDUAL</p><h2>O primeiro passo<br />é uma <em>conversa.</em></h2></div>
            <div className="start__details" data-reveal>
              <p>Conte à Penha o que você procura e em qual região está. Juntas, vocês podem conversar sobre os atendimentos e a disponibilidade.</p>
              <TrackedLink className="text-link" href={whatsappLink("Olá, Penha! Gostaria de conversar sobre os atendimentos e a disponibilidade para minha região.")} target="_blank" rel="noreferrer" eventLabel="start_conversation">Fale com a Penha <Arrow diagonal /></TrackedLink>
            </div>
          </div>
          <div className="start__rule"><span>01</span><span>CONVERSA</span><i /><span>02</span><span>ATENDIMENTO DOMICILIAR</span><i /><span>03</span><span>GRANDE VITÓRIA</span></div>
        </section>

        <section className="homecare section-pad" id="domiciliar">
          <div className="homecare__mark" aria-hidden="true"><span>ES</span><small>ATENDIMENTO LOCAL</small></div>
          <div className="homecare__copy"><p className="eyebrow">NO SEU ESPAÇO, NO SEU TEMPO</p><h2>O cuidado vai<br /><em>até você.</em></h2><p>Penha atende em domicílio na Grande Vitória, Espírito Santo. Consulte pelo WhatsApp a disponibilidade para sua região e o melhor formato para o seu atendimento.</p><TrackedLink className="text-link" href={whatsappLink("Olá, Penha! Gostaria de consultar a disponibilidade de atendimento na minha região.")} target="_blank" rel="noreferrer" eventLabel="area_availability">Consultar disponibilidade <Arrow diagonal /></TrackedLink></div>
          <div className="homecare__region">GRANDE VITÓRIA<br /><span>ESPÍRITO SANTO</span></div>
        </section>

        <section className="contact section-pad" id="contato">
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
