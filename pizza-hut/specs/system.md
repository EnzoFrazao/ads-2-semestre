# Sistema implementado

**Última verificação:** 2026-11-25  
**Referência:** `working-tree`

## Finalidade e unidade executável

Protótipo web de painel de BI para duas lojas (Holandeses, salão; Renascença, delivery). Aplicação
estática de uma página, sem back-end. **Todos os dados são fictícios**, gerados com semente fixa.

## Stack e entrypoints

- Vite, React 18, Apache ECharts (`echarts-for-react`), Framer Motion, fontes locais.
- `src/main.jsx` monta `src/App.jsx`; `npm run dev` (porta 5173) e `npm run build` (saída em `dist/`).
- Nenhum teste automatizado e nenhum lint configurado (ver `testing.md`).
- Publicação: GitHub Pages em `https://enzofrazao.github.io/ads-2-semestre/pizza-hut/`. O workflow
  `.github/workflows/ci-cd.yml` (na raiz do repositório) constrói com `--base=/ads-2-semestre/pizza-hut/`
  e junta o resultado ao site da atividade de CI/CD, que fica na raiz do mesmo site. Dispara em push na
  `main` com mudanças em `pizza-hut/**`. Fora do Pages, o `dist/` usa a base padrão (`/`).

## Fronteiras e fluxo

- `src/data/`: dados determinísticos e cálculos. `daily.js` gera uma linha por loja e dia (inclusive o
  tempo por etapa do KDS, só Holandeses) e é a fonte de tudo; `metrics.js` agrega por período;
  `kds.js` define as etapas, metas, níveis e a detecção de dias fora do padrão; `alertas.js` calcula
  os sinais amarelo e vermelho; demais arquivos tratam custos, estoque e previsão.
- `src/data/frescor.js`: "agora" da demonstração (11/11/2026, 10:00) e limites de defasagem da carga (26 h e 50 h). O estado `agora` fica em `DashContext`.
- Volumes fictícios: cerca de 1.800 pedidos por semana somando as duas lojas (Holandeses de 70 a 195 por dia, Renascença de 35 a 175), com crescimento de 0,02% e 0,04% ao dia. A previsão de 7 dias sai desses números.
- Componentes novos: `ComparativoSemana` (Visão geral), `PicoPedidos` (Vendas e mix), `DivergenciaCrescente` (Estoque), `ResumoDiario` (modal no topo, por portal no `body`) e `AvisoDados` (faixa acima do conteúdo).
- `src/sections/`: uma tela por aba (Visão geral, Entrega e iFood, Faturamento, Desperdício e CMV,
  Vendas e mix, Estoque e previsões, Produção (KDS), Dados e carga).
- `src/state/DashContext.jsx`: filtros de loja e período, aba atual e lista de abas.
- `src/chef/`: assistente Chef Hut simulado; `brain.js` responde por intenção usando os mesmos dados.
- Os números de tempo são sempre do pedido até o **despacho** (motoboy sai). Não há dado de tempo até
  o cliente além de uma taxa de cobertura (`motoIfood`), porque só o motoboy do iFood informa.

## Estado, persistência e integrações

Sem persistência e sem integração externa. A tela "Dados e carga" é demonstração: o arquivo enviado
não é processado. Tema claro/escuro fica em `localStorage`.

## Restrições e lacunas

- A análise de produção é por etapa e dia, nunca por pessoa: a aba de ranking por funcionário foi removida.
- A Renascença não tem dados de etapa (KDS ainda não instalado); as telas de produção usam só os Holandeses.
- O Chef Hut não usa IA real; trocar `answer()` em `brain.js` por uma chamada de API mantém a assinatura.
