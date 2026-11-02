# Bella Onça — Cílios & Sobrancelhas

Site em Next.js com portfólio e painel administrativo.

## O que já vem nesta versão

- Home premium na identidade bege/dourado/marrom
- Destaques e promoções editáveis
- “Qual modelo combina comigo?”
- Modelos separados em Cílios e Sobrancelhas
- Estilo do modelo: Natural, Marcante, Alongado ou Definido
- Antes & Depois com comparador arrastável
- Tabela de preços por categoria
- Galeria/portfólio por categoria
- Sobre a profissional + certificados
- Cuidados antes e depois
- FAQ editável
- Política de agendamento
- WhatsApp com mensagens automáticas por serviço/modelo
- Instagram, endereço e horário
- Avaliações com estrelas, comentário e foto
- Cliente pode enviar avaliação pelo próprio site
- Avaliações públicas ficam pendentes até aprovação no Admin
- Painel Admin para editar praticamente todo o conteúdo
- Upload de imagens pelo Admin usando Supabase Storage

## 1. Instalar

```bash
npm install
```

No Windows, se `npm` não funcionar diretamente:

```bat
npm.cmd install
npm.cmd run dev
```

## 2. Criar o `.env.local`

Copie `.env.example` para `.env.local` e preencha:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_EMAIL=email_da_admin@exemplo.com
```

A chave administrativa deve ficar somente no servidor. Não use `NEXT_PUBLIC_` nela.

## 3. Banco — projeto novo

No Supabase > SQL Editor, execute nesta ordem:

1. `supabase/migrations/001_bella_onca.sql`
2. `supabase/migrations/002_categories_before_after.sql`
3. `supabase/migrations/003_portfolio_reviews_extras.sql`

## 4. Banco — se você já executou 001 e 002

Execute apenas:

`supabase/migrations/003_portfolio_reviews_extras.sql`

Ela adiciona as novas áreas sem apagar o conteúdo já cadastrado.

## 5. Criar a conta Admin

No Supabase > Authentication > Users, crie/convide a conta com o mesmo e-mail configurado em `ADMIN_EMAIL`.

## 6. Rodar

```bash
npm run dev
```

Site: `http://localhost:3000`

Admin: `http://localhost:3000/admin`

## Avaliações enviadas pelas clientes

A cliente escolhe de 1 a 5 estrelas, escreve um comentário e pode anexar uma foto. A avaliação é salva como oculta. No Admin > Avaliações, confira o conteúdo e marque `Publicado` para ela aparecer no site.

## Observação

Sem Supabase configurado, a home usa conteúdo de demonstração. Para o Admin salvar conteúdo, enviar fotos e receber avaliações reais, configure o Supabase.
