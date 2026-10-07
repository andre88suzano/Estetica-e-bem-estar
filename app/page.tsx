import AmbientBackground from "@/components/ambient/AmbientBackground";

export default function Home() {
  return (
    <>
      <nav>
        <div className="nav-logo">Penha Andreia</div>
        <ul className="nav-links">
          <li><a href="#servicos">Serviços</a></li>
          <li><a href="#sobre">Sobre</a></li>
          <li><a href="#depoimentos">Depoimentos</a></li>
          <li><a href="#galeria">Atendimento</a></li>
        </ul>
      </nav>

      <section className="hero" id="inicio">
        <AmbientBackground preset="hero" glowTargets=".hero-title, .hero-visual" />
        <div className="hero-inner">
          <div>
            <div className="hero-eyebrow">Cuidado com atenção & dedicação</div>
            <h1 className="hero-title">Estética &<br /><em>Bem-Estar</em><br />em seu lar</h1>
            <p className="hero-subtitle">Atendimento domiciliar especializado em pós-operatório, limpeza de pele e massagem. Recuperação com conforto, cuidado e profissionalismo.</p>
            <div className="hero-btns">
              <a href="#servicos" className="btn-primary">Ver Serviços</a>
            </div>
            <div className="area-badge">📍 Espírito Santo — Grande Vitória</div>
          </div>
          <div className="hero-visual">
            <div className="hero-card">
              <div className="hero-card-icon">🏥</div>
              <div>
                <div className="hero-card-title">Pós-Operatório</div>
                <div className="hero-card-sub">Drenagem, curativo e cuidados especializados</div>
              </div>
            </div>
            <div className="hero-card">
              <div className="hero-card-icon">✨</div>
              <div>
                <div className="hero-card-title">Limpeza de Pele</div>
                <div className="hero-card-sub">Higienização profunda e tratamento facial</div>
              </div>
            </div>
            <div className="hero-card">
              <div className="hero-card-icon">🌿</div>
              <div>
                <div className="hero-card-title">Massagem</div>
                <div className="hero-card-sub">Relaxante e terapêutica</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="services" id="servicos">
        <AmbientBackground preset="soft" glowTargets=".services-header" />
        <div className="services-inner">
          <div className="services-header">
            <div className="section-badge">Serviços</div>
            <h2 className="section-title">O que ofereço</h2>
            <p className="section-subtitle">Procedimentos realizados com técnica, higiene e todo o cuidado que você merece — sem você sair de casa.</p>
          </div>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">🩹</div>
              <div className="service-title">Pós-Operatório</div>
              <p className="service-desc">Drenagem linfática, troca de curativos, acompanhamento de cicatrização e orientações de recuperação segura no seu conforto.</p>
              <span className="service-tag">→ Recuperação em casa</span>
            </div>
            <div className="service-card">
              <div className="service-icon">🌸</div>
              <div className="service-title">Limpeza de Pele</div>
              <p className="service-desc">Higienização profunda com extração de comedões, esfoliação e finalização hidratante, com produtos Adcos. Pele renovada e saudável.</p>
              <span className="service-tag">→ Pele mais saudável</span>
            </div>
            <div className="service-card">
              <div className="service-icon">🤲</div>
              <div className="service-title">Massagem Relaxante</div>
              <p className="service-desc">Técnicas que aliviam a tensão muscular, reduzem o estresse e promovem bem-estar completo para corpo e mente.</p>
              <span className="service-tag">→ Alívio & relaxamento</span>
            </div>
            <div className="service-card">
              <div className="service-icon">💧</div>
              <div className="service-title">Drenagem Linfática</div>
              <p className="service-desc">Movimentos suaves que estimulam o sistema linfático, reduzem inchaço e auxiliam na eliminação de toxinas.</p>
              <span className="service-tag">→ Redução de inchaço</span>
            </div>
            <div className="service-card">
              <div className="service-icon">💆</div>
              <div className="service-title">Massagem Terapêutica com Pedras Quentes</div>
              <p className="service-desc">Indicada para dores musculares, contraturas e tensões crônicas. Alívio eficaz e duradouro com técnica especializada.</p>
              <span className="service-tag">→ Alívio de dores</span>
            </div>
          </div>
        </div>
      </section>

      <section className="about" id="sobre">
        <AmbientBackground preset="soft" glowTargets=".about-quote, .section-title" />
        <div className="about-inner">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="about-stat-grid">
              <div className="about-stat">
                <div className="about-stat-num">+30</div>
                <div className="about-stat-label">Anos de experiência</div>
              </div>
              <div className="about-stat">
                <div className="about-stat-num">+500</div>
                <div className="about-stat-label">Clientes atendidas</div>
              </div>
              <div className="about-stat">
                <div className="about-stat-num">3</div>
                <div className="about-stat-label">Especialidades</div>
              </div>
              <div className="about-stat">
                <div className="about-stat-num">100%</div>
                <div className="about-stat-label">Domiciliar</div>
              </div>
            </div>
            <div className="about-quote">
              &quot;Cada cliente merece atenção única. Meu trabalho é levar saúde e bem-estar até você.&quot;
              <span>— Penha Andreia Miranda Suzano</span>
            </div>
          </div>
          <div>
            <div className="section-badge">Sobre Mim</div>
            <h2 className="section-title">Cuidado que<br /><em>chega até você</em></h2>
            <p style={{ color: 'var(--stone)', fontSize: '0.95rem', lineHeight: '1.8', fontWeight: '300', marginBottom: '1rem' }}>
              Sou Penha Andreia, profissional de estética e bem-estar com mais de uma década de experiência. Minha missão é levar cuidados de qualidade diretamente ao conforto da sua casa, na Grande Vitória e região.
            </p>
            <p style={{ color: 'var(--stone)', fontSize: '0.95rem', lineHeight: '1.8', fontWeight: '300', marginBottom: '1rem' }}>
              Especialista em recuperação pós-operatória, realizo drenagem linfática, curativos e acompanhamento de cicatrização com todo o profissionalismo que você merece.
            </p>
            <p style={{ color: 'var(--stone)', fontSize: '0.95rem', lineHeight: '1.8', fontWeight: '300' }}>
              Trabalho com materiais de alta qualidade, higiene rigorosa e atendimento humanizado, porque cada pessoa merece se sentir bem cuidada.
            </p>
            <div className="about-tags">
              <span className="tag">Pós-Operatório</span>
              <span className="tag">Estética Facial</span>
              <span className="tag">Massoterapia</span>
              <span className="tag">Atendimento Domiciliar</span>
              <span className="tag">Drenagem Linfática</span>
              <span className="tag">Treinamento Anna Pegova (Internacional)</span>
              <span className="tag">Biomédica — Unicesumar</span>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials" id="depoimentos">
        <AmbientBackground preset="soft" glowTargets=".testimonials-header" />
        <div className="testimonials-inner">
          <div className="testimonials-header">
            <div className="section-badge">Depoimentos</div>
            <h2 className="section-title">O que dizem minhas clientes</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>Cada atendimento deixa uma história. Veja o que dizem quem já cuidou da saúde e beleza com a Penha Andreia.</p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-text">&quot;Fiz drenagem pós-operatória com a Penha e foi incrível. Atenciosa, pontual e muito profissional. Minha recuperação foi muito mais tranquila.&quot;</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">CM</div>
                <div>
                  <div className="testimonial-name">Carla Mendes</div>
                  <div className="testimonial-info">Pós-Operatório · Grande Vitória</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-text">&quot;A limpeza de pele foi excelente! Ela cuida com tanto carinho e minha pele ficou maravilhosa. Super indico para todo mundo!&quot;</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">RL</div>
                <div>
                  <div className="testimonial-name">Renata Lima</div>
                  <div className="testimonial-info">Limpeza de Pele · Vitória</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-text">&quot;A massagem relaxante foi a melhor experiência! Vim direto para casa e dormi como há muito não dormia. Vou voltar sempre!&quot;</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">AT</div>
                <div>
                  <div className="testimonial-name">Ana Torres</div>
                  <div className="testimonial-info">Massagem · Serra</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="gallery" id="galeria">
        <AmbientBackground preset="soft" glowTargets=".gallery-header" />
        <div className="gallery-inner">
          <div className="gallery-header">
            <div className="section-badge">Atendimento</div>
            <h2 className="section-title">Cuidado no conforto da sua casa</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>Todo o material, a técnica e a atenção de um atendimento profissional, levados até você.</p>
          </div>
          <div className="gallery-grid">
            <div className="gallery-item"><div className="gallery-item-inner"><div className="gallery-icon">🏡</div><div className="gallery-label">Atendimento em casa</div></div></div>
            <div className="gallery-item"><div className="gallery-item-inner"><div className="gallery-icon">🧴</div><div className="gallery-label">Produtos de qualidade</div></div></div>
            <div className="gallery-item"><div className="gallery-item-inner"><div className="gallery-icon">✨</div><div className="gallery-label">Estética</div></div></div>
            <div className="gallery-item"><div className="gallery-item-inner"><div className="gallery-icon">🩹</div><div className="gallery-label">Pós-operatório</div></div></div>
            <div className="gallery-item"><div className="gallery-item-inner"><div className="gallery-icon">💆</div><div className="gallery-label">Massagem</div></div></div>
          </div>
        </div>
      </section>

      <footer>
        <p>© 2025 <span>Penha Andreia Miranda Suzano</span> — Estética & Bem-Estar · Atendimento Domiciliar · Grande Vitória, ES</p>
      </footer>
    </>
  );
}
