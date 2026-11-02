# ✨ Bella Onça — Cílios & Sobrancelhas

Website responsivo para apresentação de serviços de beleza, desenvolvido com **Next.js, TypeScript e Supabase**.

O projeto reúne uma interface elegante, portfólio interativo, integração com WhatsApp, sistema de avaliações e um painel administrativo para gerenciamento de conteúdo.

🌐 **[Visualizar site publicado](https://bella-onca-website.vercel.app/)**

---

## 📖 Sobre o projeto

O **Bella Onça** é uma aplicação web voltada para a apresentação de serviços de cílios e sobrancelhas.

A interface utiliza uma identidade visual em tons de bege, dourado e marrom, com foco em navegação intuitiva, responsividade e uma experiência moderna.

Além da área pública, o projeto possui um painel administrativo integrado ao Supabase, permitindo gerenciar conteúdos sem precisar editar o código-fonte.

## 🚀 Funcionalidades

### Interface e experiência
- Design responsivo para computadores e dispositivos móveis.
- Página inicial com destaques e promoções editáveis.
- Ferramenta interativa **"Qual modelo combina comigo?"**.
- Categorias independentes de cílios e sobrancelhas.
- Classificação de modelos por estilo: Natural, Marcante, Alongado e Definido.
- Comparador interativo de imagens de Antes & Depois.
- Galeria de trabalhos organizada por categoria.
- Tabela de preços por serviço.
- Apresentação profissional e certificados.
- Informações sobre cuidados antes e depois dos procedimentos.
- Perguntas frequentes (FAQ) e política de agendamento.

### Contato e agendamento
- Integração com WhatsApp.
- Mensagens pré-preenchidas conforme o serviço escolhido.
- Links para Instagram.
- Informações de endereço e horário de atendimento.

### Sistema de avaliações
- Avaliações de 1 a 5 estrelas.
- Envio de comentários e fotografias.
- Moderação das avaliações pelo administrador.
- Publicação somente após aprovação.

### Painel administrativo
- Gerenciamento de conteúdos do site.
- Cadastro e edição de serviços e preços.
- Controle de destaques e promoções.
- Gerenciamento de imagens e galerias.
- Aprovação de avaliações.
- Upload de arquivos pelo Supabase Storage.

## 🛠️ Tecnologias

| Tecnologia | Utilização |
|---|---|
| Next.js | Framework de desenvolvimento web |
| React | Construção das interfaces |
| TypeScript | Tipagem e organização do código |
| Supabase | Banco de dados e autenticação |
| Supabase Storage | Armazenamento de imagens |
| Vercel | Hospedagem e deploy |

## ⚙️ Instalação e execução

### 1. Clonar o repositório

```bash
git clone https://github.com/Ltleandrodev/bella-onca-website.git
cd bella-onca-website
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env.local` utilizando o `.env.example` como referência:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_EMAIL=seu_email@exemplo.com
```

**Atenção:** mantenha a `SUPABASE_SERVICE_ROLE_KEY` somente no servidor e nunca publique credenciais privadas no repositório.

### 4. Configurar banco de dados

Acesse o **SQL Editor** do Supabase e execute as migrações nesta ordem:

1. `supabase/migrations/001_bella_onca.sql`
2. `supabase/migrations/002_categories_before_after.sql`
3. `supabase/migrations/003_portfolio_reviews_extras.sql`

Se as duas primeiras migrações já foram executadas, utilize apenas a terceira.

### 5. Configurar administrador

No Supabase, acesse **Authentication → Users** e crie ou convide a conta correspondente ao e-mail configurado em `ADMIN_EMAIL`.

### 6. Executar localmente

```bash
npm run dev
```

**Aplicação:** http://localhost:3000

**Painel administrativo:** http://localhost:3000/admin

## 🔐 Administração e avaliações

O sistema permite que visitantes enviem avaliações com estrelas, comentários e imagens.

As avaliações permanecem ocultas até serem aprovadas pelo administrador, que pode gerenciá-las diretamente pelo painel.

O painel também oferece recursos para manutenção dos serviços, conteúdos e imagens do site.

## 📝 Observações

- O projeto utiliza conteúdo demonstrativo quando o Supabase não está configurado.
- O gerenciamento de dados, o envio de imagens e as avaliações dependem da configuração do Supabase.
- As credenciais administrativas não devem ser incluídas no código-fonte.
- O projeto é apresentado como demonstração técnica de desenvolvimento web.

---

### 👨‍💻 Desenvolvimento

**LT Dev — Desenvolvimento Web & APIs**

[GitHub](https://github.com/Ltleandrodev) • [Projeto online](https://bella-onca-website.vercel.app/)

*Desenvolvido com foco em experiência do usuário, organização e funcionalidades administrativas.*
