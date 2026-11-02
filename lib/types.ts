export type Service = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  price: number;
  active: boolean;
  sort_order: number;
};

export type ModelItem = {
  id: string;
  title: string;
  category: string;
  description: string | null;
  image_url: string | null;
  price: number;
  style_tag: string;
  featured: boolean;
  active: boolean;
  sort_order: number;
};

export type BeforeAfter = {
  id: string;
  title: string;
  category: string;
  service: string | null;
  description: string | null;
  before_url: string | null;
  after_url: string | null;
  active: boolean;
  sort_order: number;
};

export type Review = {
  id: string;
  client_name: string;
  text: string;
  rating: number;
  photo_url: string | null;
  source?: string | null;
  active: boolean;
  sort_order: number;
};

export type GalleryItem = {
  id: string;
  title: string;
  category: string;
  description: string | null;
  image_url: string | null;
  active: boolean;
  sort_order: number;
};

export type Certificate = {
  id: string;
  title: string;
  issuer: string | null;
  year: string | null;
  image_url: string | null;
  active: boolean;
  sort_order: number;
};

export type Highlight = {
  id: string;
  title: string;
  subtitle: string | null;
  badge: string | null;
  image_url: string | null;
  button_text: string | null;
  button_message: string | null;
  active: boolean;
  sort_order: number;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  active: boolean;
  sort_order: number;
};

export type SiteSettings = {
  id: number;
  hero_title: string;
  hero_subtitle: string;
  about_text: string;
  whatsapp: string;
  instagram: string;
  address: string;
  hours: string;
  professional_name: string;
  professional_title: string;
  professional_photo_url: string;
  booking_policy: string;
  care_before: string;
  care_after: string;
};

export type SiteContent = {
  services: Service[];
  models: ModelItem[];
  beforeAfter: BeforeAfter[];
  reviews: Review[];
  gallery: GalleryItem[];
  certificates: Certificate[];
  highlights: Highlight[];
  faqs: Faq[];
  settings: SiteSettings;
};
