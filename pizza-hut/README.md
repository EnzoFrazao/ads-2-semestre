# Pizza Hut BI · Protótipo do painel

Protótipo web dos dashboards da plataforma de BI das duas lojas (Holandeses, salão; Renascença, delivery).
**Todos os dados são fictícios**, calibrados com o briefing de 20/10/2026. Não representam resultados reais.

## Como rodar

Requer Node 18 ou superior.

```bash
npm install
npm run dev
```

Abra http://localhost:5173. Para pular a abertura animada, use http://localhost:5173/?skip.

Build de produção: `npm run build` (saída em `dist/`) e `npm run preview`.

## O que tem

- **8 abas**: Visão geral, Entrega e iFood (selo SUPER), Faturamento, Desperdício e CMV, Vendas e mix, Estoque e previsões, Equipe, Dados e carga.
- **Filtros** de loja (todas, Holandeses, Renascença) e período (7 dias, 4 semanas, 13 semanas, 12 meses).
- **Tema claro e escuro**, na mesma paleta dos slides (vermelho Pizza Hut). Segue o tema do sistema na primeira visita.
- **Chef Hut**, assistente no canto inferior direito, com perguntas prontas e chat livre. É **simulado**: não usa API; as respostas vêm dos mesmos dados do painel (`src/chef/brain.js`).
- **Modo apresentação** (botão Apresentar): percorre as abas sozinho; Esc sai.
- **Exportar**: CSV da aba atual ou impressão/PDF.
- **Dados e carga**: demonstração de envio de planilha com validação simulada.

## Estrutura

```
src/data/       dados fictícios determinísticos e cálculos (métricas, previsão, alertas)
src/sections/   uma tela por aba
src/components/ gráficos (ECharts), cards, tabelas, topo e abas
src/chef/       avatar e "cérebro" do assistente
src/theme/      paletas claro/escuro
src/styles/     tokens, base e layout
```

Stack: Vite, React 18, Apache ECharts, Framer Motion, fontes locais (@fontsource).
