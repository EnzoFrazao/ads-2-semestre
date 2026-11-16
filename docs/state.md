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

- [ ] Conferir no GitHub que o workflow `CI/CD - Painel de deploy` ficou verde e que o Pages
  (`atividade-ci-cd`) está no ar; depois conferir o envio no EAD (tarefa id 25599, vence 2026-11-19).
- [ ] Protótipo do painel: Chef Hut é simulado (`src/chef/brain.js`); trocar por API real é o
  próximo passo se o projeto avançar. Dados 100% fictícios (`src/data/`).

## Decisões importantes
- `atividade-ci-cd/`: app estático (sem dependências) + testes com `node --test`; o workflow fica na
  **raiz** (`.github/workflows/ci-cd.yml`, exigência do GitHub) e usa `working-directory`. Deploy no
  GitHub Pages via `actions/deploy-pages`. A entrega no EAD é um print (nome do GitHub + teste verde).
- Armadilha: `fs.cpSync` derruba o Node 22.23 no Windows (exit 0xC0000409, sem mensagem); o
  `scripts/build.mjs` copia arquivo a arquivo por isso. Em `bash` do Claude Code o `node` não está no
  PATH — rodar `npm`/`node` pelo PowerShell.
- Só o código de `pizza-hut/dashboard-prototipo/` é versionado; briefing, PDF, `resumo.md` e
  `pizza hut.txt` ficam locais de propósito (material pessoal).
- `pizza-hut/dashboard-prototipo/`: Vite + React + ECharts + Framer Motion, rodando local
  (`npm install && npm run dev`, porta 5173). Períodos são múltiplos de 7 dias (7d, 28d, 91d, 364d)
  para a variação contra o período anterior não ser distorcida por dias da semana.
- Armadilha de teste: com o painel do navegador embutido oculto, `requestAnimationFrame` não roda e
  as animações ficam presas em opacidade 0; verificar com o painel visível.
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

## Última sessão (2026-11-16, Claude)
- Criada a `atividade-ci-cd/` (painel de deploy + 5 testes) e o workflow de CI/CD; testes e build ok
  localmente. Commitado junto o protótipo `pizza-hut/dashboard-prototipo/`.

## Sessão anterior (2026-11-11, Claude)
- Criado `pizza-hut/dashboard-prototipo/`: protótipo web do painel de BI (8 abas, tema claro/escuro,
  assistente Chef Hut simulado, modo apresentação, demo de carga de planilha). README próprio dentro.
- Verificado no navegador: todas as abas em escuro, Visão geral em claro, mobile 375 px sem rolagem
  horizontal, chat, carga de exemplo, modo apresentação; `npm run build` ok.

## Sessão de 2026-10-13 (Claude)
- Criado e publicado o `README.md` da raiz (índice para recrutadores): destaques, uma tabela por
  disciplina e como rodar.
- Tirada do README da `entrega1-userflow` a nota interna "Pendência" de compartilhamento do Figma
  (o lembrete foi para as Pendências).
- Sessão anterior (2026-10-08): 7 entregas do EAD resolvidas e enviadas, com links em `tree/main`.
