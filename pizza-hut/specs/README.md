# Memória técnica do projeto

Contrato necessário para entender e modificar o protótipo do painel de BI das lojas Pizza Hut.

## Ordem de leitura

1. Leia este índice.
2. Abra somente a capability relacionada.
3. Consulte `system.md` para confirmar o implementado.
4. Consulte `testing.md` antes de alterar cobertura.
5. Leia `open-decisions.md` antes de assumir qualquer regra de negócio ainda aberta.
6. Consulte o handoff local `docs/state.md` na raiz do repositório, quando existir (não versionado).

## Autoridade

| Documento | Autoridade |
|---|---|
| `capabilities/*.md` | Contrato e estado de entrega |
| `system.md` | Arquitetura realmente implementada |
| `testing.md` | Estratégia e mapa de evidências |
| `open-decisions.md` | Questões que não podem ser inventadas |
| `history.md` | Marcos; Git preserva o detalhe |

## Roteamento por tarefa

| Tema | Ler |
|---|---|
| Painel, abas, indicadores, tempo de entrega e etapas do KDS | `capabilities/core.md` |
| Estrutura de pastas, dados fictícios, tema, Chef Hut | `system.md` |
| Como provar que funciona | `testing.md` |
| Regras que o cliente ainda não fechou | `open-decisions.md` |

## Manutenção

- Mudança funcional atualiza a capability.
- Mudança de evidência atualiza `testing.md`.
- Decisão duradoura cria ou substitui ADR (ainda não há nenhum).
- Marco relevante atualiza `history.md`.
- Material de levantamento com o cliente (briefing, transcrições, resumos) fica fora do Git.
