# Decisões

Nenhuma decisão de negócio está aberta no momento. As cinco abaixo foram fechadas com o cliente em 2026-11-25.

## Resolvidas

### P-001 — Definição e meta do tempo de entrega

- **Decisão:** a meta oficial da franqueadora é 15 min; os ~19 min são o valor atual dos Holandeses.
- **Aplicado em:** `META_ENTREGA` em `src/data/daily.js` e metas por etapa em `src/data/kds.js` (sem mudança de código).

### P-002 — Tempo até o cliente com a cooperativa de motoboys

- **Decisão:** o tempo até o cliente depende do local e a cooperativa não informa. O que vale é o tempo até o motoboy sair, com meta de 15 min.
- **Aplicado em:** o painel mede até o despacho e mostra só a cobertura (`motoIfood`) do tempo até o cliente. Se a cooperativa passar a informar saída e entrega, reabrir.

### P-003 — Origem e formato dos dados

- **Decisão:** as fontes serão upload de planilha e API de banco de dados.
- **Aplicado em:** a tela "Dados e carga" segue como demonstração do upload; a API ainda não existe no protótipo. O modelo de colunas é o da exportação CSV (`src/components/ExportButton.jsx`).

### P-004 — Frequência de atualização

- **Decisão:** carga diária.
- **Aplicado em:** `src/data/frescor.js`: aviso de dados desatualizados quando a última carga passa de 26 h (atenção) e de 50 h (crítico).

### P-005 — Detecção de furto por funcionário

- **Decisão:** manter a regra provisória: só divergência de estoque crescente por item, nunca por pessoa.
- **Aplicado em:** `src/components/DivergenciaCrescente.jsx` e o alerta `estoque-*` em `src/data/alertas.js`.
