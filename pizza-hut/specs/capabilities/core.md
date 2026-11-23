---
id: core
contract_status: draft
implementation_status: partial
last_verified: 2026-11-23
last_verified_ref: working-tree
---

# Painel de BI das duas lojas

## Finalidade e limites

Dar ao dono e aos gerentes uma visão única de faturamento, desperdício e CMV, vendas, estoque,
entrega e produção das duas lojas, sem depender de relatório enviado por terceiros. O que existe
hoje é um **protótipo com dados fictícios**; não há integração com os sistemas reais.

## Atores, permissões, entradas e resultados

- Dono e gerentes consultam; não há login nem perfis neste protótipo.
- Entradas: filtros de loja (todas, Holandeses, Renascença) e período (7 dias, 4, 13 semanas, 12 meses).
- Resultados: indicadores, gráficos, sinais amarelo e vermelho, exportação em CSV e impressão em PDF.

## Contrato comportamental e critérios de aceite

- O tempo de entrega é medido do pedido cair na central até o motoboy sair (despacho); a meta é de 15 min.
- O tempo até o cliente só pode ser exibido para pedidos com motoboy do iFood; o painel mostra a cobertura, nunca uma estimativa para os demais.
- A aba Produção (KDS) mostra o tempo por etapa (montagem, forno, corte e caixa, despacho) com meta por etapa cuja soma é a meta de despacho.
- A análise de produção é por etapa e dia da semana, nunca por pessoa.
- Só os Holandeses têm dados de etapa; quando a Renascença está selecionada, a aba avisa e mostra os Holandeses.
- Dias em que o despacho passa de 1,6 vez a mediana de 90 dias da loja aparecem como "fora do padrão", com a recomendação de checar o equipamento do KDS antes de cobrar a equipe, e geram um sinal de atenção.
- Os dados do iFood têm até 48 h de defasagem e isso é avisado na tela.
- O selo SUPER do iFood é avaliado por nota (mínimo 4,7), cancelamento (abaixo de 1%) e taxa de acordo (abaixo de 2,5%).
- O CMV aceito é de 28% a 32%; fora disso gera sinal.

## Invariantes e regras de negócio

- Todos os números do protótipo são determinísticos (semente fixa) e os mesmos em todas as telas, nos alertas e no Chef Hut.
- A soma das metas por etapa é igual a `META_ENTREGA`; o módulo falha ao carregar se isso deixar de valer.
- A Renascença exige no mínimo 10 motoboys de sexta a domingo.

## Estado atual e lacunas

Implementado como protótipo: as 8 abas, filtros, alertas, exportação, tema, Chef Hut simulado e modo apresentação.
Lacunas: nenhuma integração real, carga de planilha só demonstrativa, sem login, sem testes automatizados,
sem tempo até o cliente para a cooperativa, sem KDS na Renascença. Regras ainda em aberto estão em
[open-decisions.md](../open-decisions.md).

## Evidências de implementação e teste

- Implementação: `src/data/daily.js`, `src/data/kds.js`, `src/data/alertas.js`, `src/sections/ProducaoKds.jsx`, `src/sections/EntregaIfood.jsx`.
- Gate executável: `npm run build`. Não há teste automatizado de comportamento; ver [testing.md](../testing.md).

## Relações

- Decisões abertas: `P-001` a `P-005`, em [open-decisions.md](../open-decisions.md).
- ADR relacionado: nenhum.
