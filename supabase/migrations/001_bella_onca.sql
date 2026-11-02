create extension if not exists pgcrypto;

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'Cílios',
  description text,
  price numeric(10,2) not null default 0,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.models (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'Cílios',
  description text,
  image_url text,
  price numeric(10,2) not null default 0,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.before_after (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'Cílios',
  service text,
  description text,
  before_url text,
  after_url text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  text text not null,
  rating integer not null default 5 check (rating between 1 and 5),
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1),
  hero_title text not null default 'Seu olhar, sua assinatura.',
  hero_subtitle text not null default 'Cílios e sobrancelhas com técnica, delicadeza e personalidade.',
  about_text text not null default 'Na Bella Onça, cada atendimento é pensado para valorizar seus traços e realçar sua beleza de forma elegante e personalizada.',
  whatsapp text not null default '',
  instagram text not null default 'bellaonca.studio',
  address text not null default '',
  hours text not null default 'Atendimento com horário agendado'
);

insert into public.site_settings (id) values (1) on conflict (id) do nothing;

alter table public.services enable row level security;
alter table public.models enable row level security;
alter table public.before_after enable row level security;
alter table public.reviews enable row level security;
alter table public.site_settings enable row level security;

-- Leitura pública somente do conteúdo publicado.
drop policy if exists "public read active services" on public.services;
create policy "public read active services" on public.services for select using (active = true);
drop policy if exists "public read active models" on public.models;
create policy "public read active models" on public.models for select using (active = true);
drop policy if exists "public read active before_after" on public.before_after;
create policy "public read active before_after" on public.before_after for select using (active = true);
drop policy if exists "public read active reviews" on public.reviews;
create policy "public read active reviews" on public.reviews for select using (active = true);
drop policy if exists "public read site settings" on public.site_settings;
create policy "public read site settings" on public.site_settings for select using (true);

-- Conteúdo inicial de demonstração.
insert into public.services (name, category, description, price, sort_order)
select * from (values
  ('Volume Brasileiro','Cílios','Volume elegante com efeito marcante e confortável.',120.00,1),
  ('Manutenção de cílios','Cílios','Reposição e acabamento para manter o olhar impecável.',80.00,2),
  ('Lash Lifting','Cílios','Curvatura e definição dos fios naturais.',95.00,3),
  ('Design de Sobrancelhas','Sobrancelhas','Mapeamento e acabamento personalizado para o seu rosto.',40.00,4),
  ('Design + Henna','Sobrancelhas','Definição com preenchimento e efeito natural.',55.00,5),
  ('Brow Lamination','Sobrancelhas','Fios alinhados, definidos e com aparência mais cheia.',110.00,6)
) as v(name,category,description,price,sort_order)
where not exists (select 1 from public.services);

insert into public.reviews (client_name, text, rating, sort_order)
select * from (values
  ('Cliente Bella','Atendimento maravilhoso e resultado delicado. Amei meu olhar!',5,1),
  ('Cliente Bella','Muito capricho, ambiente confortável e cílios lindos.',5,2),
  ('Cliente Bella','Minha sobrancelha ficou exatamente como eu queria.',5,3)
) as v(client_name,text,rating,sort_order)
where not exists (select 1 from public.reviews);
insert into public.before_after (title, category, service, description, sort_order)
select * from (values
  ('Transformação do olhar','Cílios','Volume Brasileiro','Exemplo visual para a seção. Troque pelas fotos reais no painel Admin.',1),
  ('Sobrancelhas definidas','Sobrancelhas','Design + Henna','Cadastre fotos reais de antes e depois pelo painel.',2)
) as v(title,category,service,description,sort_order)
where not exists (select 1 from public.before_after);

