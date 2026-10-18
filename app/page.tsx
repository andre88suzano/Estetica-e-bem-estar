import { Suspense } from "react";
import Image from "next/image";
import andreiaSuzano from "@/assets/andreia-suzano.webp";
import { PageViewTracker } from "@/components/PageViewTracker";
import { Pending } from "@/components/Pending";
import { SiteHeader } from "@/components/SiteHeader";
import { TrackedLink } from "@/components/TrackedLink";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { credentials, faqs, postopDisclaimer, postopPoints, serviceAreas, services, steps, testimonials } from "@/lib/content";
import { formatPhone, site, whatsappLink } from "@/lib/site";

export default function Home() {
  return (
    <>
      <Suspense fallback={null}><PageViewTracker /></Suspense>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <SiteHeader />
      <main id="conteudo">
        <section className="hero" id="inicio" aria-labelledby="hero-title">
          <div className="container hero__grid">
            <div className="hero__content">
              <p className="eyebrow">Atendimento estético domiciliar · {site.region}</p>
              <h1 id="hero-title">Cuidado estético profissional, <em>no conforto da sua casa.</em></h1>
              <p className="hero__lead">
                Andreia Suzano leva o atendimento até você, com mais de 30 anos de experiência em estética e atenção a cada pessoa.
              </p>
              <div className="actions">
                <TrackedLink className="button button--primary" href={whatsappLink("Olá, Andreia! Gostaria de conversar sobre um atendimento domiciliar.")} target="_blank" rel="noreferrer" eventLabel="hero_primary">
                  <WhatsAppIcon /> Conversar pelo WhatsApp
                </TrackedLink>
                <a className="button button--secondary" href="#tratamentos">Ver tratamentos</a>
              </div>
              <ul className="credentials" aria-label="Credenciais">
                {credentials.map((item) => (
                  <li key={item.value}><strong>{item.value}</strong><span>{item.label}</span></li>
                ))}
              </ul>
            </div>
            <figure className="hero__portrait">
              <Image
                src={andreiaSuzano}
                alt="Andreia Suzano, profissional de estética e bem-estar, de jaleco branco"
                priority
                sizes="(max-width: 860px) 92vw, 460px"
              />
              <Pending>Foto profissional da Andreia (retrato vertical, boa luz, fundo neutro). A foto atual é provisória.</Pending>
            </figure>
          </div>
        </section>

        <section className="section services" id="tratamentos" aria-labelledby="services-title">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">Tratamentos</p>
              <h2 id="services-title">Um cuidado para <em>cada necessidade.</em></h2>
              <p>Conheça as possibilidades e converse com Andreia para entender o que faz sentido para você.</p>
            </div>
            <ul className="service-grid">
              {services.map((service, index) => (
                <li className={`service-card${index === 0 ? " service-card--featured" : ""}`} key={service.slug}>
                  <p className="service-card__category">{service.category}</p>
                  <h3>{service.name}</h3>
                  <p className="service-card__detail">{service.detail}</p>
                  {index === 0 ? (
                    <a className="text-link" href="#pos-operatorio">Como funciona o pós-operatório <span aria-hidden="true">→</span></a>
                  ) : (
                    <TrackedLink className="text-link" href={whatsappLink(`Olá, Andreia! Gostaria de saber mais sobre ${service.name.toLowerCase()}.`)} target="_blank" rel="noreferrer" eventLabel={`service_0${index + 1}`}>
                      Perguntar pelo WhatsApp<span className="sr-only"> sobre {service.name.toLowerCase()}</span> <span aria-hidden="true">↗</span>
                    </TrackedLink>
                  )}
                </li>
              ))}
            </ul>
            <Pending>Fotos reais e autorizadas dos atendimentos, e a duração de cada tratamento, se Andreia quiser informar.</Pending>
          </div>
        </section>

        <section className="section postop" id="pos-operatorio" aria-labelledby="postop-title">
          <div className="container postop__grid">
            <div className="postop__heading">
              <p className="eyebrow eyebrow--on-dark">Cuidado especializado</p>
              <h2 id="postop-title">Pós-operatório, <em>com atenção e cuidado.</em></h2>
              <p>Um acompanhamento individualizado no ambiente domiciliar, com respeito às orientações da equipe médica responsável.</p>
              <TrackedLink className="button button--light" href={whatsappLink("Olá, Andreia! Gostaria de conversar sobre atendimento estético no pós-operatório.")} target="_blank" rel="noreferrer" eventLabel="postoperative">
                <WhatsAppIcon /> Falar sobre o pós-operatório
              </TrackedLink>
            </div>
            <div className="postop__details">
              <ul className="postop__points">
                {postopPoints.map((point) => (
                  <li key={point.title}><h3>{point.title}</h3><p>{point.text}</p></li>
                ))}
              </ul>
              <p className="postop__disclaimer"><strong>Importante:</strong> {postopDisclaimer}</p>
            </div>
          </div>
        </section>

        <section className="section about" id="sobre" aria-labelledby="about-title">
          <div className="container about__grid">
            <div className="about__heading">
              <p className="eyebrow">Sobre a Andreia</p>
              <h2 id="about-title">Mais de três décadas <em>dedicadas à estética.</em></h2>
            </div>
            <div className="about__copy">
              <p>
                Há mais de 30 anos, Andreia Suzano dedica sua trajetória à estética. Trabalhou na Anna Pegova, em São Paulo,
                é formada em Estética e Biomedicina e está cursando uma pós-graduação.
              </p>
              <p>Hoje, leva esse cuidado até você, com atendimento domiciliar na Grande Vitória e atenção individual a cada pessoa.</p>
              <dl className="facts">
                <div><dt>Experiência</dt><dd>Mais de 30 anos em estética</dd></div>
                <div><dt>Formação</dt><dd>Estética e Biomedicina · pós-graduação em andamento</dd></div>
                <div><dt>Trajetória</dt><dd>Anna Pegova, São Paulo</dd></div>
                <div><dt>Atendimento</dt><dd>Domiciliar, na {site.region}</dd></div>
              </dl>
              <a className="text-link" href={site.instagram} target="_blank" rel="noreferrer">Acompanhe no Instagram {site.instagramHandle} <span aria-hidden="true">↗</span></a>
              <Pending>Registro profissional (se houver) e uma segunda foto da Andreia em atendimento, com autorização.</Pending>
            </div>
          </div>
        </section>

        <section className="section steps" id="como-funciona" aria-labelledby="steps-title">
          <div className="container">
            <div className="section-heading section-heading--center">
              <p className="eyebrow">Como funciona</p>
              <h2 id="steps-title">O primeiro passo <em>é uma conversa.</em></h2>
            </div>
            <ol className="step-list">
              {steps.map((step, index) => (
                <li key={step.title}>
                  <span className="step-list__number" aria-hidden="true">{index + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>
            <div className="actions actions--center">
              <TrackedLink className="button button--primary" href={whatsappLink("Olá, Andreia! Gostaria de conversar sobre os atendimentos e a disponibilidade para minha região.")} target="_blank" rel="noreferrer" eventLabel="start_conversation">
                <WhatsAppIcon /> Começar pelo WhatsApp
              </TrackedLink>
            </div>
          </div>
        </section>

        {testimonials.length > 0 ? (
          <section className="section testimonials" id="depoimentos" aria-labelledby="testimonials-title">
            <div className="container">
              <div className="section-heading">
                <p className="eyebrow">Depoimentos</p>
                <h2 id="testimonials-title">Quem já recebeu <em>o cuidado da Andreia.</em></h2>
              </div>
              <ul className="testimonial-list">
                {testimonials.map((item) => (
                  <li key={item.author}>
                    <blockquote><p>{item.quote}</p></blockquote>
                    <p className="testimonial-list__author">{item.author}{item.service ? ` · ${item.service}` : ""}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : (
          <div className="container"><Pending>Depoimentos reais, com autorização por escrito de cada cliente. A seção aparece automaticamente quando forem adicionados em <code>lib/content.ts</code>.</Pending></div>
        )}

        <section className="section faq" id="duvidas" aria-labelledby="faq-title">
          <div className="container faq__grid">
            <div className="faq__area">
              <p className="eyebrow">Área de atendimento</p>
              <h2 id="faq-title">Atendimento em casa, <em>na Grande Vitória.</em></h2>
              <p>Andreia atende em domicílio na Grande Vitória, Espírito Santo. Consulte pelo WhatsApp a disponibilidade para a sua região.</p>
              {serviceAreas.length > 0 && (
                <ul className="area-list" aria-label="Regiões atendidas">
                  {serviceAreas.map((area) => <li key={area}>{area}</li>)}
                </ul>
              )}
              <TrackedLink className="button button--secondary" href={whatsappLink("Olá, Andreia! Gostaria de consultar a disponibilidade de atendimento na minha região.")} target="_blank" rel="noreferrer" eventLabel="area_availability">
                Consultar minha região <span aria-hidden="true">↗</span>
              </TrackedLink>
              {serviceAreas.length === 0 && <Pending>Lista das cidades ou bairros atendidos (por exemplo, quais municípios da Grande Vitória).</Pending>}
            </div>
            <div className="faq__list">
              <h3 className="faq__title">Perguntas frequentes</h3>
              {faqs.map((faq) => (
                <details key={faq.question}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
              <Pending>Respostas sobre duração da sessão, dias e horários de atendimento e preparo antes da sessão.</Pending>
            </div>
          </div>
        </section>

        <section className="section contact" id="contato" aria-labelledby="contact-title">
          <div className="container contact__inner">
            <h2 id="contact-title">Vamos conversar <em>sobre o seu cuidado?</em></h2>
            <p>Conte à Andreia o que você procura. Ela vai orientar você sobre os atendimentos e a disponibilidade.</p>
            <TrackedLink className="button button--light" href={whatsappLink("Olá, Andreia! Gostaria de conversar sobre um atendimento domiciliar na Grande Vitória.")} target="_blank" rel="noreferrer" eventLabel="final_contact">
              <WhatsAppIcon /> Iniciar conversa pelo WhatsApp
            </TrackedLink>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer__grid">
          <div>
            <p className="brand__name brand__name--footer">Andreia Suzano</p>
            <p>Estética &amp; Bem-Estar · Atendimento domiciliar na {site.region}</p>
          </div>
          <ul className="footer__contacts" aria-label="Contatos">
            <li>
              <TrackedLink href={whatsappLink("Olá, Andreia! Gostaria de saber sobre os atendimentos domiciliares.")} target="_blank" rel="noreferrer" eventLabel="footer_whatsapp">
                WhatsApp {formatPhone(site.whatsappNumber)}
              </TrackedLink>
            </li>
            <li><a href={site.instagram} target="_blank" rel="noreferrer">Instagram {site.instagramHandle}</a></li>
          </ul>
          <p className="footer__copy">© {new Date().getFullYear()} Andreia Suzano</p>
        </div>
        <TrackedLink
          className="floating-whatsapp"
          href={whatsappLink("Olá, Andreia! Gostaria de saber sobre os atendimentos domiciliares.")}
          target="_blank"
          rel="noreferrer"
          eventLabel="floating_whatsapp"
          aria-label="Conversar com Andreia pelo WhatsApp"
        >
          <WhatsAppIcon />
        </TrackedLink>
      </footer>

    </>
  );
}
