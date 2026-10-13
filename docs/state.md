# Estado do projeto

## Visão atual
Repositório de entregas das disciplinas do curso ADS (CEUMA), semestre 2026/2.
Cada disciplina é uma pasta na raiz; cada entrega é `entregaN-slug/` ou
`desafio-slug/` dentro dela. O EAD (Moodle, ead.ceuma.br) é a fonte da
verdade sobre o que está pendente — este repositório não lista atividades
futuras, só o que já foi resolvido.

## Pendências
- [ ] Conferir se o FigJam do user flow (entrega1-userflow) está com compartilhamento
  "Qualquer pessoa com o link pode visualizar". A nota de pendência saiu do README público
  em 2026-10-13 e o lembrete ficou aqui.
- [ ] A disciplina "Desenvolvimento de Interfaces Dinâmicas e Reativas" já
  aparece no EAD (curso id 3055 / seção id 12826) mas ainda não tem nenhum
  entregável publicado — ainda não existe pasta pra ela aqui. Verificar no
  EAD quando a primeira atividade for aberta.

## Decisões importantes
- O README da **raiz** é um índice voltado para recrutadores, que linka as entregas. Ele não
  contradiz a regra abaixo, que vale para as pastas de entrega.
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

## Última sessão (2026-10-13, Claude)
- Criado e publicado o `README.md` da raiz (índice para recrutadores): destaques, uma tabela por
  disciplina e como rodar.
- Tirada do README da `entrega1-userflow` a nota interna "Pendência" de compartilhamento do Figma
  (o lembrete foi para as Pendências).
- Sessão anterior (2026-10-08): 7 entregas do EAD resolvidas e enviadas, com links em `tree/main`.
