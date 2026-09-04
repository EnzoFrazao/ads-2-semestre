<div align="center">

# `<EF />` &nbsp;·&nbsp; Portfólio TechX

**Portfólio pessoal de Enzo Frazão Vêncio** — Backend Developer & Software Engineer.

Single-page application com estética *cyberpunk / terminal*: fundo em grid, blobs ambientes,
efeito de glitch no nome, barras de skill animadas por scroll e navegação com seção ativa.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

</div>

---

## Preview

### `01.` Hero — apresentação e terminal interativo

Nome com glitch periódico, subtítulo, bio e um bloco de terminal falso rodando
`whoami`, `cat skills.json`, `echo $LOCATION` e `status`. Cards flutuantes destacam
tempo de experiência e volume de projetos.

![Seção hero do portfólio, com o nome "Enzo Frazao" em destaque e um painel de terminal ao lado](docs/screenshots/01-hero.png)

### `02.` Habilidades — barras animadas

Sete competências principais com nível percentual. Cada barra tem cor própria, brilho neon
e anima de `0%` até o valor final quando entra no viewport (`IntersectionObserver`).
Abaixo, tags de conceitos e práticas.

![Seção de habilidades com barras de progresso coloridas para PHP/Laravel, Java/Spring Boot, Python/FastAPI e outras](docs/screenshots/02-habilidades.png)

### `03.` Projetos — grid de cards

Seis projetos em grid responsivo. Cada card traz ícone, tag de contexto, descrição,
stack utilizada e link para o repositório correspondente no GitHub.

![Grid de cards de projetos: SafeWork, Agiliza Transparência, Project IA, Vértice Consultoria, Gerenciamento de Solicitações e TechX Front](docs/screenshots/03-projetos.png)

### `04.` Experiência — timeline vertical

Trajetória profissional e acadêmica em linha do tempo, com gradiente conectando os marcos
e um ponto colorido por entrada.

![Timeline de experiência mostrando os cargos na STC/MA, na SafeWork e a graduação em Engenharia de Software](docs/screenshots/04-experiencia.png)

### `05.` Contato — call to action e rodapé

Chamada final com botões de e-mail e LinkedIn, links sociais e rodapé.

![Seção de contato com o título "vamos construir algo juntos" e botões de e-mail e LinkedIn](docs/screenshots/05-contato.png)

---

## Sobre o projeto

Portfólio de página única, sem backend e sem dependências de UI externas — todo o visual é
construído com Tailwind CSS v4 e estilos inline. O conteúdo (skills, projetos e experiência)
fica em constantes tipadas no topo de [`src/App.tsx`](src/App.tsx), o que torna a atualização
uma edição de array, não de JSX.

**Destaques técnicos**

- **Sem bibliotecas de animação.** As transições usam apenas `IntersectionObserver`,
  `transition` do Tailwind e keyframes em CSS.
- **Navegação com seção ativa.** Um observer marca a seção visível e destaca o item
  correspondente no menu; a navbar ganha `backdrop-filter` após 60px de scroll.
- **Scroll suave nativo**, via `scrollIntoView({ behavior: "smooth" })`.
- **Tipagem estrita.** `strict: true` no `tsconfig.json`, com os cards derivando o tipo
  direto do array de projetos (`typeof PROJECTS[0]`).
- **Responsivo.** Grid de 1 → 2 → 3 colunas, menu adaptado para telas menores.

---

## Stack

| Camada | Tecnologia |
| --- | --- |
| UI | React 19 · React DOM 19 |
| Linguagem | TypeScript 5.7 |
| Build | Vite 8 · `@vitejs/plugin-react` |
| Estilo | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Formatação | oxfmt |
| Toolchain | Node 22 · pnpm 10 (via [mise](https://mise.jdx.dev)) |

Tipografia: **Orbitron** (display), **Inter** (corpo) e **JetBrains Mono** (código),
carregadas do Google Fonts em [`src/index.css`](src/index.css).

---

## Estrutura

```
front-portifolio/
├─ docs/
│  └─ screenshots/        # imagens usadas neste README
├─ src/
│  ├─ App.tsx             # componente único: dados, seções e subcomponentes
│  ├─ main.tsx            # entrypoint React; monta <App /> em #root
│  ├─ index.css           # fontes, tema Tailwind v4 (@theme) e keyframes
│  └─ vite-env.d.ts
├─ index.html             # shell do Vite
├─ vite.config.ts         # React + Tailwind v4 + plugins do Figma Make; alias @ → src
├─ tsconfig.json
└─ package.json
```

---

## Rodando localmente

Pré-requisitos: **Node 22+**. O lockfile do projeto é do pnpm.

**1. Clone o repositório**

```bash
git clone https://github.com/EnzoFrazao/portifolioTechX.git
```

**2. Instale as dependências**

```bash
pnpm install
```

**3. Suba o servidor de desenvolvimento**

```bash
pnpm dev
```

A aplicação sobe em `http://localhost:8443` (a porta vem de `$PORT`, com `strictPort`).

> Usando npm? Troque por `npm install` e `npm run dev` — o `pnpm-lock.yaml` não será
> respeitado, então as versões resolvidas podem diferir levemente.

### Scripts

| Comando | O que faz |
| --- | --- |
| `pnpm dev` | Servidor de desenvolvimento com hot reload |
| `pnpm build` | Build de produção em `dist/` |
| `pnpm preview` | Serve o build de produção localmente |
| `pnpm format` | Formata o código com oxfmt |

---

## Personalizando o conteúdo

Todo o conteúdo editável está nas constantes no topo de [`src/App.tsx`](src/App.tsx):

| Constante | Controla |
| --- | --- |
| `NAV_LINKS` | Itens do menu — os valores precisam bater com os `id` das `<section>` |
| `SKILLS` | Nome, percentual e cor de cada barra de habilidade |
| `PROJECTS` | Nome, tag, descrição, stack, cor, ícone e link de cada card |
| `EXPERIENCE` | Cargo, empresa, período, descrição e cor de cada item da timeline |

As cores do tema ficam no bloco `@theme` de [`src/index.css`](src/index.css):

| Token | Valor | Uso |
| --- | --- | --- |
| `--color-neon` | `#00ff87` | Destaque primário, links ativos, CTA |
| `--color-cyan` | `#00d4ff` | Destaque secundário |
| `--color-void` | `#05050f` | Fundo da página |
| `--color-surface` | `#0d0d1a` | Superfícies elevadas |
| `--color-card` | `#111128` | Fundo dos cards |
| `--color-border` | `#1e1e40` | Bordas e divisores |
| `--color-fg` | `#e8e8ff` | Texto principal |
| `--color-fg-dim` | `#8888bb` | Texto secundário |

---

## Nota sobre o Figma Make

O projeto foi gerado no **Figma Make**, e o `vite.config.ts` carrega plugins próprios da
plataforma que leem `.figma/make/site.json` (título, metadados e opções de acessibilidade).
Esses plugins estão declarados no próprio arquivo de config e versionados junto — o build
funciona normalmente fora do Figma. Para desacoplar por completo, remova as chamadas
`figma*()` do array `plugins` e preencha as tags do `index.html` manualmente.

---

## Contato

- **GitHub** — [@EnzoFrazao](https://github.com/EnzoFrazao)
- **LinkedIn** — [enzofrazaovencio](https://linkedin.com/in/enzofrazaovencio)
- **E-mail** — [enzofrazaoengsoft@gmail.com](mailto:enzofrazaoengsoft@gmail.com)

<div align="center">
<sub>built with <b>React</b> + <b>TypeScript</b></sub>
</div>
