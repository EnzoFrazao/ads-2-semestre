# Estado do projeto — Design de Experiência e Prototipação

## Visão atual

Matéria com 3 entregas semanais em Figma/FigJam (User Flow, protótipo/telas, portfólio).
O material já existia espalhado em `frontend/entrega1-prototipo` (banco digital techX)
e `frontend/entrega2-portifolio` (portfólio codado) — eram desta matéria, só estavam na
pasta errada. Os dois projetos foram **movidos** (não copiados) para cá:
`entrega1-prototipo` → `entrega2-prototipo/`, `entrega2-portifolio` → `entrega3-portfolio/`.
A pasta `frontend/` foi removida depois que ficou vazia. Tudo já foi commitado e enviado
para `origin/main` (commit `470dd02`).

## Pendências

- [ ] **Página individual de projeto (Semana 03)** não implementada — ver Decisões
  importantes. Sem plano de retomada; Enzo decidiu não seguir com o requisito.

## Decisões importantes

- **Problema/Solução da Entrega 2 foram reconstruídos, não transcritos**: não havia
  registro do enunciado sorteado em aula; o README documenta isso explicitamente e
  descreve o problema a partir do que o protótipo techX resolve na prática.
- **Código-fonte não foi duplicado**: `entrega2-prototipo/` e `entrega3-portfolio/` são
  os próprios projetos React movidos para cá (não cópias), então o histórico e os
  arquivos completos (src/, specs/, docs/) vieram junto.
- **Página individual de projeto (Semana 03) — não implementada**: o enunciado pede uma
  tela de detalhe por projeto ao clicar no card. Cheguei a implementar isso via troca de
  estado em `App.tsx` e testar localmente, mas o Enzo decidiu não seguir com esse
  requisito ("não precisa dessa tela intermediária") — a alteração foi revertida
  (`git checkout`) e o README da Entrega 3 documenta essa lacuna abertamente em vez de
  omitir.
- **FigJam da Entrega 1 com permissão liberada**: o arquivo foi criado com acesso
  restrito por padrão (nenhuma ferramenta automatizada muda essa configuração); Enzo
  liberou manualmente para "qualquer pessoa com o link pode visualizar".
- **Nome da pasta da Entrega 2**: chamada de `entrega2-nocode-doc` na primeira versão,
  renomeada para `entrega2-prototipo` a pedido do Enzo (2026-09-19) — nome mais fiel ao
  conteúdo (é o protótipo techX documentado, não um projeto "sem código" no sentido
  literal).

## Última sessão (2026-09-19, Claude)

- Confirmado com Enzo que `frontend/entrega1-prototipo` (techX) e
  `frontend/entrega2-portifolio` pertencem a esta matéria; **movidos** para
  `entrega2-prototipo/` e `entrega3-portfolio/` (não apenas documentados à parte);
  `frontend/` removida.
- Gerado o User Flow (Entrega 1) no FigJam via MCP do Figma (`generate_diagram`) a
  partir do fluxo de login + Pix do techX; permissão de link liberada por Enzo.
- Tentativa de página individual de projeto no portfólio foi implementada, testada
  localmente e depois **revertida** a pedido do Enzo — não faz parte da entrega.
- READMEs de `entrega2-prototipo` e `entrega3-portfolio` reescritos combinando o
  conteúdo técnico original de cada projeto com as seções exigidas pelo enunciado
  (Sobre o projeto, Problema, Solução proposta, Telas, Figma / Apresentação, Stacks,
  Projetos).
- Commitado e enviado ao GitHub (`470dd02`, `main`).
- Pasta `entrega2-nocode-doc` renomeada para `entrega2-prototipo`; links internos em
  `entrega1-userflow/README.md` atualizados. Ainda não commitado (pendente de entrega
  manual pelo Enzo).
