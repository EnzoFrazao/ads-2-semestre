# Arquitetura implementada

## Visão

SPA React de tela única de celular, sem backend. Todo o dado vem de um módulo de
mock tipado; a UI é organizada em quatro camadas com dependência em uma direção só.

```
screens/      →  components/  →  primitives
   ↓                 ↓
  lib/  (format · selectors · hooks · PixFlow)
   ↓
 data/mock.ts  →  types/
```

`data/` e `types/` não importam nada acima deles. `lib/` não importa `components/`
nem `screens/`. Isso mantém a lógica testável sem montar React.

## Decisões

### `HashRouter` em vez de `BrowserRouter`
O destino é publicação estática (GitHub Pages), onde não há servidor para reescrever
`/extrato` no `index.html`. Hash evita 404 em deep link. **Se um dia houver
servidor próprio, trocar por `BrowserRouter` e configurar o fallback.**

### Dinheiro em centavos (`amountCents`)
Todo valor monetário é inteiro em centavos e só vira decimal no formatador. Evita
o erro clássico de ponto flutuante ao somar. `formatMoney` divide por 100 na borda.

### Data de referência fixa (`REFERENCE_DATE = 2026-08-20T09:41`)
"Hoje" e "Ontem" são calculados contra essa constante, não contra `new Date()`.
Dois motivos: os dados de demonstração ficariam envelhecidos em uma semana, e os
screenshots do README precisam ser reprodutíveis. **Ao ligar em uma API real,
`formatRelativeDay` já aceita a data de hoje como segundo argumento — basta parar
de usar o padrão.**

### Estado do Pix em contexto, não em rota
O fluxo tem 3 passos em rotas separadas, mas destinatário/valor/mensagem vivem em
`PixFlowProvider`. Recarregar `/pix/valor` direto redireciona para `/pix/destino`,
porque o estado não sobrevive ao reload. É intencional: colocar valores monetários
na URL seria pior.

### `useAsyncData` simula latência
Não existe rede, mas as telas precisam exercitar loading/erro/vazio. O hook entrega
o ciclo `loading → ready | error` com atraso configurável. **É o ponto de troca:
quando houver API, este hook vira o wrapper da chamada real e as telas não mudam.**

### Tokens no CSS, não em `tailwind.config`
Tailwind 4 lê `@theme` direto do `index.css`. Manter os tokens lá deixa uma fonte
única — as mesmas variáveis servem utilitário Tailwind e CSS puro (usado nos
`divide-[color:var(--color-line)]`).

## Acessibilidade — o que está garantido

- Foco visível global via `:focus-visible` (não removido em lugar nenhum)
- Landmarks: `<header>`, `<main>`, `<nav aria-label>`
- `aria-current` na aba ativa, `aria-pressed` nos toggles, `role="progressbar"` nas barras de limite
- `Sheet` fecha no Esc, tem `role="dialog"`/`aria-modal` e devolve o foco a quem abriu
- Toasts em região `aria-live="polite"`
- Contraste de texto verificado em WCAG AA (pior caso 4.9:1)
- `prefers-reduced-motion` neutraliza animações e transições globalmente

## Captura de telas

`scripts/screenshots.mjs` sobe `vite preview`, dirige um Chrome local via
`puppeteer-core` e grava `docs/screens/*.png` em 390×844 @2x. As telas do fluxo Pix
não são alcançáveis por URL (dependem do contexto), então o script **percorre o
fluxo clicando** — o que também funciona como teste de fumaça do caminho feliz.

Antes de cada captura ele marca `document.documentElement.dataset.capture = "true"`,
o que congela animações e transições via regra em `index.css`. Sem isso os
screenshots pegariam skeletons e estados intermediários.
