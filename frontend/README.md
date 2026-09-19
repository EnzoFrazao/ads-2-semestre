# Entregas — Front-end

Trabalhos de front-end da faculdade, um por pasta. Cada entrega é um projeto independente,
com o seu próprio `package.json`, as suas dependências e o seu README completo.

| # | Entrega | Pasta | Stack |
|---|---------|-------|-------|
| 1 | **techX** — protótipo de banco digital mobile (13 telas, fluxo de Pix ponta a ponta) | [`entrega1-prototipo/`](entrega1-prototipo/) | React 18 · TypeScript 5.7 · Vite 6 · Tailwind 4 |
| 2 | **Portfólio TechX** — portfólio pessoal single-page, estética cyberpunk/terminal | [`entrega2-portifolio/`](entrega2-portifolio/) | React 19 · TypeScript 5.7 · Vite 8 · Tailwind 4 |

Cada README traz capturas de tela reais, decisões de projeto e instruções de execução:

- [README da entrega 1 — techX](entrega1-prototipo/README.md)
- [README da entrega 2 — Portfólio TechX](entrega2-portifolio/README.md)

## Rodando uma entrega

As entregas não compartilham dependências: entre na pasta e instale ali.

```bash
cd entrega1-prototipo
npm install
npm run dev
```

A entrega 2 usa **pnpm** (versão fixada em `.mise.toml`):

```bash
cd entrega2-portifolio
pnpm install
pnpm dev
```

## Histórico

Este repositório reúne trabalhos que antes moravam em repositórios separados. O histórico de
commits de cada um foi preservado — `git log` mostra os commits originais já sob a pasta atual.
