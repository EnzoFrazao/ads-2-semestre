# Estado do projeto

## Visão atual
Repositório de entregas das disciplinas do curso ADS (CEUMA), semestre 2026/2.
Cada disciplina é uma pasta na raiz; cada entrega é `entregaN-slug/` ou
`desafio-slug/` dentro dela. O EAD (Moodle, ead.ceuma.br) é a fonte da
verdade sobre o que está pendente — este repositório não lista atividades
futuras, só o que já foi resolvido.

## Pendências
- [ ] Nenhuma pendência conhecida no momento (ver "Última sessão").
- [ ] A disciplina "Desenvolvimento de Interfaces Dinâmicas e Reativas" já
  aparece no EAD (curso id 3055 / seção id 12826) mas ainda não tem nenhum
  entregável publicado — ainda não existe pasta pra ela aqui. Verificar no
  EAD quando a primeira atividade for aberta.

## Decisões importantes
- Entregas de Python e Web não levam README por padrão (removido de
  propósito no histórico do repo) — só ganham README quando o enunciado da
  atividade exige explicitamente (ex.: entregas que pedem "repositório no
  GitHub" com justificativa/diagrama).
- Submissão no Moodle: quando a atividade aceita "Texto online", o padrão
  usado é só `Link para repositório: <link>` + uma linha opcional dizendo em
  qual arquivo está a resposta — nada de texto longo copiado do enunciado.
- O campo de texto do Moodle usa o editor TinyMCE, que só inicializa alguns
  segundos depois da página carregar e esconde a `<textarea>` real
  (`display: none`). Escrever direto na textarea via JS/`fill_input` não
  funciona (o TinyMCE sobrescreve ao sincronizar) — é preciso esperar
  `tinymce.activeEditor.id === 'id_onlinetext_editor'` (ser verdadeiro;
  `tinymce.get('id_onlinetext_editor')` não funciona de forma confiável neste
  Moodle — `tinymce.editors` não é um array populado, usar `tinymce.activeEditor`)
  e então usar `.setContent(html)` + `.save()`.
- Links das entregas no Moodle apontam para `tree/main/...` no GitHub, nunca
  para a branch de feature — a branch pode ser excluída depois do merge e
  quebraria o link; `main` é o destino estável.
- As entregas reais (Tarefas/`mod/assign`) do semestre ficam no curso Moodle
  "FRONTEND FAIXAS AZUIS" (id 2961, categoria TECHX), organizadas em blocos
  "Entregáveis" por disciplina — não nos cursos oficiais "11 | GPADSM | ..."
  (ids 3052-3055), que só têm materiais/fóruns e **não têm nenhuma Tarefa**
  (`mod/assign/index.php?id=3052` retorna "Não há Tarefas neste curso"). Ao
  procurar uma entrega no EAD, ir direto para `mod/assign/index.php?id=2961`.

## Última sessão (2026-10-08, Claude)
- Resolvidas e commitadas as 7 entregas pendentes do EAD: Python semanas 4-6
  (`Desenvolvimento em Python/entrega{4,5,6}-*`) e Web semanas 3-5 +
  desafio Vite+React (`Desenvolvimento para Web/entrega{3,4,5}-*` e
  `desafio-vite-componentes-reutilizaveis/`).
- Todas as 7 enviadas no Moodle (confirmado "Enviado para avaliação" em
  cada uma); PR #2 aberto e mergeado em `main`.
- Auditoria de verificação: todas as 7 estavam "Enviado para avaliação", mas
  o link de todas apontava para a branch de feature em vez de `main`.
  Corrigido nas 7 (reenviadas com `tree/main/...`); status confirmado
  novamente como "Enviado para avaliação" em todas após a correção.
