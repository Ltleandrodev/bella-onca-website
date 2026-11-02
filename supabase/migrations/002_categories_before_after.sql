-- Adiciona categorias à seção Antes & Depois em projetos que já executaram a migration 001.
alter table public.before_after
  add column if not exists category text not null default 'Cílios';

-- Classifica registros antigos de sobrancelhas quando for possível identificar pelo nome do serviço/título.
update public.before_after
set category = 'Sobrancelhas'
where category = 'Cílios'
  and (
    coalesce(service, '') ilike '%sobrancelh%'
    or coalesce(service, '') ilike '%henna%'
    or coalesce(service, '') ilike '%brow%'
    or coalesce(title, '') ilike '%sobrancelh%'
    or coalesce(title, '') ilike '%henna%'
    or coalesce(title, '') ilike '%brow%'
  );
