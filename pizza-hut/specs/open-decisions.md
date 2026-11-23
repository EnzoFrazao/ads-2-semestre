# Decisões abertas

## P-001 — Definição e meta do tempo de entrega

- **Problema:** o cliente falou em meta de 19 min e objetivo de 15 min; o painel usa meta de 15 min.
- **Pergunta:** a meta oficial da franqueadora é 15 min, e os ~19 min são o valor atual dos Holandeses? A medição é sempre do pedido na central até o motoboy sair?
- **Responsável esperado:** cliente (dono das lojas).
- **Impacto:** muda `META_ENTREGA` e as metas por etapa em `src/data/daily.js` e `src/data/kds.js`.
- **Regra provisória:** meta de 15 min e valor atual próximo de 19 min, como interpretado na reunião de levantamento.
- **Capability:** `core`.

## P-002 — Tempo até o cliente com a cooperativa de motoboys

- **Problema:** só o motoboy do iFood informa o tempo depois que sai da loja; a cooperativa, usada em quase todos os pedidos, não informa.
- **Pergunta:** a cooperativa pode fornecer horário de saída e de entrega?
- **Responsável esperado:** cliente e cooperativa.
- **Impacto:** sem isso o painel só mede até o despacho.
- **Regra provisória:** mostrar apenas a cobertura (parcela dos pedidos com esse dado).
- **Capability:** `core`.

## P-003 — Origem e formato dos dados

- **Problema:** a fonte pode ser API ainda não disponibilizada ou planilha; foi citada integração com Power BI, ainda não confirmada.
- **Pergunta:** qual será a fonte de cada sistema (sistema da loja, Toqan/iFood, KDS) e o formato?
- **Responsável esperado:** cliente.
- **Impacto:** define a carga de dados real e o modelo de planilha.
- **Regra provisória:** manter a tela de carga como demonstração e o modelo de colunas da exportação CSV.
- **Capability:** `core`.

## P-004 — Frequência de atualização

- **Problema:** o relatório deve ser diário, mas o envio atual é às segundas, quartas e sextas.
- **Pergunta:** a carga será diária ou nesses três dias?
- **Responsável esperado:** cliente.
- **Impacto:** a defasagem exibida e os alertas de dado desatualizado.
- **Regra provisória:** exibir a data e hora da última carga.
- **Capability:** `core`.

## P-005 — Detecção de furto por funcionário

- **Problema:** o cliente quer saber se há furto; o painel só mostra divergência de estoque.
- **Pergunta:** que sinal conta como indício, sem expor pessoas por um número isolado?
- **Responsável esperado:** cliente.
- **Impacto:** possível nova tela ou regra de alerta.
- **Regra provisória:** só divergências crescentes de estoque por item, nunca por pessoa.
- **Capability:** `core`.
