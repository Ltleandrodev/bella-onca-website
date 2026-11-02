import type { SiteContent } from "./types";

export const demoContent: SiteContent = {
  services: [
    { id: "s1", name: "Volume Brasileiro", category: "Cílios", description: "Volume elegante com efeito marcante e confortável.", price: 120, active: true, sort_order: 1 },
    { id: "s2", name: "Manutenção de cílios", category: "Cílios", description: "Reposição e acabamento para manter o olhar impecável.", price: 80, active: true, sort_order: 2 },
    { id: "s3", name: "Lash Lifting", category: "Cílios", description: "Curvatura e definição dos fios naturais.", price: 95, active: true, sort_order: 3 },
    { id: "s4", name: "Design de Sobrancelhas", category: "Sobrancelhas", description: "Mapeamento e acabamento personalizado para o seu rosto.", price: 40, active: true, sort_order: 4 },
    { id: "s5", name: "Design + Henna", category: "Sobrancelhas", description: "Definição com preenchimento e efeito natural.", price: 55, active: true, sort_order: 5 },
    { id: "s6", name: "Brow Lamination", category: "Sobrancelhas", description: "Fios alinhados, definidos e com aparência mais cheia.", price: 110, active: true, sort_order: 6 }
  ],
  models: [
    { id: "m1", title: "Volume Brasileiro", category: "Cílios", description: "Efeito preenchido e elegante para valorizar o olhar.", image_url: "/bella-onca-reference.jpeg", price: 120, style_tag: "Marcante", featured: true, active: true, sort_order: 1 },
    { id: "m2", title: "Efeito Delineado", category: "Cílios", description: "Alongamento com destaque no canto externo.", image_url: "/bella-onca-reference.jpeg", price: 135, style_tag: "Alongado", featured: false, active: true, sort_order: 2 },
    { id: "m3", title: "Design + Henna", category: "Sobrancelhas", description: "Formato personalizado com preenchimento suave.", image_url: "/bella-onca-reference.jpeg", price: 55, style_tag: "Definido", featured: true, active: true, sort_order: 3 }
  ],
  beforeAfter: [
    { id: "b1", title: "Transformação do olhar", category: "Cílios", service: "Volume Brasileiro", description: "Exemplo visual para a seção. Troque pelas fotos reais no painel Admin.", before_url: "/bella-onca-reference.jpeg", after_url: "/bella-onca-reference.jpeg", active: true, sort_order: 1 },
    { id: "b2", title: "Sobrancelhas definidas", category: "Sobrancelhas", service: "Design + Henna", description: "Cadastre fotos reais de antes e depois pelo painel.", before_url: "/bella-onca-reference.jpeg", after_url: "/bella-onca-reference.jpeg", active: true, sort_order: 2 }
  ],
  reviews: [
    { id: "r1", client_name: "Cliente Bella", text: "Atendimento maravilhoso e resultado delicado. Amei meu olhar!", rating: 5, photo_url: null, source: "admin", active: true, sort_order: 1 },
    { id: "r2", client_name: "Cliente Bella", text: "Muito capricho, ambiente confortável e cílios lindos.", rating: 5, photo_url: null, source: "admin", active: true, sort_order: 2 },
    { id: "r3", client_name: "Cliente Bella", text: "Minha sobrancelha ficou exatamente como eu queria.", rating: 5, photo_url: null, source: "admin", active: true, sort_order: 3 }
  ],
  gallery: [
    { id: "g1", title: "Detalhes do olhar", category: "Cílios", description: "Use o painel para trocar por fotos reais do trabalho.", image_url: "/bella-onca-reference.jpeg", active: true, sort_order: 1 },
    { id: "g2", title: "Design personalizado", category: "Sobrancelhas", description: "Galeria organizada por categoria.", image_url: "/bella-onca-reference.jpeg", active: true, sort_order: 2 }
  ],
  certificates: [
    { id: "c1", title: "Aperfeiçoamento profissional", issuer: "Certificação Bella Onça", year: "2026", image_url: null, active: true, sort_order: 1 }
  ],
  highlights: [
    { id: "h1", title: "Destaque do mês", subtitle: "Escolha um procedimento para aparecer em evidência na página inicial.", badge: "DESTAQUE", image_url: "/bella-onca-reference.jpeg", button_text: "Quero saber mais", button_message: "Olá! Vi o destaque do mês no site da Bella Onça e gostaria de saber mais.", active: true, sort_order: 1 }
  ],
  faqs: [
    { id: "f1", question: "Quanto tempo dura uma extensão de cílios?", answer: "A duração varia conforme os cuidados e o ciclo natural dos fios. A profissional orienta o período ideal de manutenção para cada técnica.", active: true, sort_order: 1 },
    { id: "f2", question: "Posso escolher um modelo pela foto?", answer: "Sim. As fotos são referências e o efeito pode ser adaptado ao formato dos seus olhos, sobrancelhas e fios naturais.", active: true, sort_order: 2 },
    { id: "f3", question: "Como faço para agendar?", answer: "Use qualquer botão de WhatsApp do site e envie o serviço ou modelo que deseja.", active: true, sort_order: 3 }
  ],
  settings: {
    id: 1,
    hero_title: "Seu olhar, sua assinatura.",
    hero_subtitle: "Cílios e sobrancelhas com técnica, delicadeza e personalidade.",
    about_text: "Na Bella Onça, cada atendimento é pensado para valorizar seus traços e realçar sua beleza de forma elegante e personalizada.",
    whatsapp: "",
    instagram: "bellaonca.studio",
    address: "",
    hours: "Atendimento com horário agendado",
    professional_name: "Bella Onça",
    professional_title: "Especialista em cílios e sobrancelhas",
    professional_photo_url: "/bella-onca-reference.jpeg",
    booking_policy: "Agendamentos são confirmados pelo WhatsApp. Em caso de atraso, cancelamento ou necessidade de reagendamento, avise com antecedência.",
    care_before: "Chegue sem maquiagem na região dos olhos.\nEvite produtos oleosos antes do procedimento.\nAvise sobre sensibilidades ou alergias.",
    care_after: "Siga as orientações recebidas no atendimento.\nEvite atrito excessivo na região.\nRespeite o período recomendado para manutenção."
  }
};
