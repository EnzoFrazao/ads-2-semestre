# Estratégia de testes

## Situação atual — honesta

**Não há suíte de testes automatizados.** Nenhum `vitest`, nenhum `playwright`.
Isto está registrado como dívida, não como decisão.

O que existe hoje como verificação real:

| Verificação | Comando | O que cobre |
|---|---|---|
| Checagem de tipos | `npm run build` (`tsc -b` em modo `strict`) | Todo o `src/`, sem `any` implícito e sem variável não usada |
| Build de produção | `npm run build` | Resolução de imports, alias `@/`, geração do bundle |
| Teste de fumaça do Pix | `npm run screens` | Percorre contato → valor → confirmação → sucesso → comprovante clicando na UI real. Se qualquer passo quebrar, o script falha |
| Inspeção visual | `docs/screens/*.png` | As 13 telas renderizadas, revisadas a olho |

O `npm run screens` é o mais próximo de um end-to-end que o projeto tem: ele não
afirma nada sobre o conteúdo, mas **falha se o caminho feliz do Pix quebrar**.

## O que deveria existir, por prioridade

1. **Unitário em `lib/`** — é onde mora a lógica pura e onde um bug seria silencioso:
   - `format.ts`: `digitsToCents`, `formatRelativeDay` na virada do dia, `maskPixKey` por tipo
   - `selectors.ts`: `groupByDay` com dias vazios, `monthSummary`, `spendByCategory` com total zero
   - `PixFlow.validateAmount`: zero, acima do saldo, acima do teto
   - Ferramenta natural: `vitest`, sem precisar de DOM
2. **Componente** — `Sheet` (Esc fecha, foco volta), `Money` (oculto x visível),
   `BottomNav` (`aria-current` na rota certa). `@testing-library/react`.
3. **End-to-end** — promover o percurso do `screenshots.mjs` a Playwright com
   asserções de verdade: o valor confirmado é o digitado, o comprovante mostra o
   mesmo destinatário, a validação bloqueia valor acima do saldo.
4. **Acessibilidade automatizada** — `axe-core` nas 13 rotas. Hoje as garantias de
   acessibilidade foram feitas por construção e revisão manual, não por asserção.

## Ao alterar cobertura

Este arquivo é a autoridade sobre a estratégia. Se adicionar suíte, atualize a
tabela de "situação atual" e mova o item correspondente para fora da lista de
prioridades — não deixe as duas seções se contradizerem.
