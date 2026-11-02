-- Bella Onça V1.3 — avaliações com foto, galeria, destaques, certificados, FAQ e informações extras.
-- Pode ser executada depois das migrations 001 e 002.

alter table public.reviews add column if not exists photo_url text;
alter table public.reviews add column if not exists source text not null default 'admin';

alter table public.models add column if not exists style_tag text not null default 'Natural';
alter table public.models add column if not exists featured boolean not null default false;

alter table public.site_settings add column if not exists professional_name text not null default 'Bella Onça';
alter table public.site_settings add column if not exists professional_title text not null default 'Especialista em cílios e sobrancelhas';
alter table public.site_settings add column if not exists professional_photo_url text not null default '';
alter table public.site_settings add column if not exists booking_policy text not null default 'Agendamentos são confirmados pelo WhatsApp. Em caso de atraso, cancelamento ou necessidade de reagendamento, avise com antecedência.';
alter table public.site_settings add column if not exists care_before text not null default 'Chegue sem maquiagem na região dos olhos.\nEvite produtos oleosos antes do procedimento.\nAvise sobre sensibilidades ou alergias.';
alter table public.site_settings add column if not exists care_after text not null default 'Siga as orientações recebidas no atendimento.\nEvite atrito excessivo na região.\nRespeite o período recomendado para manutenção.';

create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'Cílios',
  description text,
  image_url text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text,
  year text,
  image_url text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.highlights (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  badge text,
  image_url text,
  button_text text,
  button_message text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.gallery enable row level security;
alter table public.certificates enable row level security;
alter table public.highlights enable row level security;
alter table public.faqs enable row level security;

drop policy if exists "public read active gallery" on public.gallery;
create policy "public read active gallery" on public.gallery for select using (active = true);
drop policy if exists "public read active certificates" on public.certificates;
create policy "public read active certificates" on public.certificates for select using (active = true);
drop policy if exists "public read active highlights" on public.highlights;
create policy "public read active highlights" on public.highlights for select using (active = true);
drop policy if exists "public read active faqs" on public.faqs;
create policy "public read active faqs" on public.faqs for select using (active = true);

insert into public.gallery (title, category, description, sort_order)
select * from (values
  ('Detalhes do olhar','Cílios','Troque esta demonstração por uma foto real no Admin.',1),
  ('Design personalizado','Sobrancelhas','Use a galeria para mostrar trabalhos completos.',2)
) as v(title,category,description,sort_order)
where not exists (select 1 from public.gallery);

insert into public.certificates (title, issuer, year, sort_order)
select * from (values
  ('Aperfeiçoamento profissional','Bella Onça','2026',1)
) as v(title,issuer,year,sort_order)
where not exists (select 1 from public.certificates);

insert into public.highlights (title, subtitle, badge, button_text, button_message, sort_order)
select * from (values
  ('Destaque do mês','Escolha um procedimento ou novidade para aparecer em evidência na página inicial.','DESTAQUE','Quero saber mais','Olá! Vi o destaque do mês no site da Bella Onça e gostaria de saber mais.',1)
) as v(title,subtitle,badge,button_text,button_message,sort_order)
where not exists (select 1 from public.highlights);

insert into public.faqs (question, answer, sort_order)
select * from (values
  ('Quanto tempo dura uma extensão de cílios?','A duração varia conforme os cuidados e o ciclo natural dos fios. A profissional orienta o período ideal de manutenção para cada técnica.',1),
  ('Posso escolher um modelo pela foto?','Sim. As fotos são referências e o efeito pode ser adaptado ao formato dos seus olhos, sobrancelhas e fios naturais.',2),
  ('Como faço para agendar?','Use qualquer botão de WhatsApp do site e envie o serviço ou modelo que deseja.',3)
) as v(question,answer,sort_order)
where not exists (select 1 from public.faqs);
