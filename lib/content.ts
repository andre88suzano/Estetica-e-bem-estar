// Site copy. Everything here comes from the existing site or the verified
// brief in AGENTS.md. Empty lists are waiting for real, authorized content:
// their sections stay hidden in production until they are filled in.

export type Service = {
  slug: string;
  name: string;
  category: string;
  detail: string;
};

export const services: Service[] = [
  { slug: "pos-operatorio", name: "Pós-operatório", category: "Cuidado especializado", detail: "Acompanhamento individualizado em diálogo com as orientações da equipe de saúde responsável." },
  { slug: "tratamentos-faciais", name: "Tratamentos faciais", category: "Facial", detail: "Limpeza de pele e cuidados faciais conduzidos com atenção às necessidades de cada pele." },
  { slug: "drenagem-linfatica", name: "Drenagem linfática", category: "Corporal", detail: "Técnica manual realizada com cuidado e adaptada ao contexto e às necessidades de cada atendimento." },
  { slug: "massagens-terapeuticas", name: "Massagens terapêuticas", category: "Bem-estar", detail: "Um atendimento individualizado para momentos de tensão e cuidado corporal." },
  { slug: "pedras-quentes", name: "Pedras quentes", category: "Bem-estar", detail: "Massagem com pedras aquecidas, realizada em um ritmo acolhedor e atento ao seu conforto." },
];

export const credentials = [
  { value: "+30 anos", label: "de experiência em estética" },
  { value: "Estética e Biomedicina", label: "formação · pós-graduação em andamento" },
  { value: "Anna Pegova", label: "experiência profissional em São Paulo" },
];

export const postopPoints = [
  { title: "Escuta antes de tudo", text: "Entender o momento e as orientações recebidas ajuda a conduzir o atendimento com responsabilidade." },
  { title: "Cuidado em casa", text: "O atendimento domiciliar oferece acolhimento e praticidade durante o período de recuperação." },
  { title: "Cada caso é único", text: "Recursos e condutas são conversados individualmente. O atendimento respeita as orientações da equipe médica." },
];

export const postopDisclaimer = "A indicação e o momento de cada cuidado devem ser avaliados com a equipe de saúde responsável.";

export const steps = [
  { title: "Chame no WhatsApp", text: "Conte à Andreia o que você procura e em qual região está." },
  { title: "Combine o atendimento", text: "Ela orienta sobre os tratamentos, a disponibilidade e o melhor formato para você." },
  { title: "Receba o cuidado em casa", text: "O atendimento acontece no seu espaço, na Grande Vitória." },
];

export type Faq = { question: string; answer: string };

export const faqs: Faq[] = [
  { question: "O atendimento é feito em casa?", answer: "Sim. Andreia atende em domicílio na Grande Vitória, Espírito Santo. Consulte pelo WhatsApp a disponibilidade para a sua região." },
  { question: "Andreia atende no pós-operatório?", answer: "Sim, com acompanhamento individualizado e respeitando as orientações da equipe médica responsável. A indicação e o momento de cada cuidado devem ser avaliados com a equipe de saúde responsável." },
  { question: "Qual é a formação da Andreia?", answer: "Andreia tem mais de 30 anos de experiência em estética, é formada em Estética e Biomedicina e está cursando uma pós-graduação. Trabalhou na Anna Pegova, em São Paulo." },
  { question: "Como faço para agendar?", answer: "Pelo WhatsApp. Conte o que você procura e em qual região está, e Andreia orienta sobre os atendimentos e a disponibilidade." },
  { question: "Quais são os valores?", answer: "Para saber valores, fale com a Andreia pelo WhatsApp." },
];

/** Real, authorized client quotes only. The section is hidden while empty. */
export type Testimonial = { quote: string; author: string; service?: string };
export const testimonials: Testimonial[] = [];

/** Cities or neighborhoods served, confirmed by Andreia. Hidden while empty. */
export const serviceAreas: string[] = [];
