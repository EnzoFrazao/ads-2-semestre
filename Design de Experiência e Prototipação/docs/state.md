# Estado do projeto — Design de Experiência e Prototipação

## Visão atual

Matéria com 3 entregas semanais em Figma/FigJam (User Flow, doc sem-código, portfólio).
O material já existia espalhado em `frontend/entrega1-prototipo` (banco digital techX)
e `frontend/entrega2-portifolio` (portfólio codado) — eram desta matéria, só estavam na
pasta errada. Os dois projetos foram **movidos** (não copiados) para cá:
`entrega1-prototipo` → `entrega2-nocode-doc/`, `entrega2-portifolio` → `entrega3-portfolio/`.
A pasta `frontend/` ficou só com o `.gitignore` — decisão pendente sobre removê-la (ver
Pendências).

## Pendências

- [ ] **Liberar permissão de visualização do FigJam** (Entrega 1). O arquivo
  `https://www.figma.com/board/PWHQcrea0yJjOVQd6oNa6l` foi criado via API com acesso
  restrito à conta; é preciso abrir logado no Figma e mudar o compartilhamento para
  "Qualquer pessoa com o link pode visualizar". Nenhuma ferramenta automatizada tem
  permissão para essa configuração.
- [ ] **Decidir o que fazer com a pasta `frontend/`**, agora vazia (só `.gitignore`) —
  remover de vez ou manter como está.

## Decisões importantes

- **Problema/Solução da Entrega 2 foram reconstruídos, não transcritos**: não havia
  registro do enunciado sorteado em aula; o README documenta isso explicitamente e
  descreve o problema a partir do que o protótipo techX resolve na prática.
- **Código-fonte não foi duplicado**: `entrega2-nocode-doc/` e `entrega3-portfolio/` são
  os próprios projetos React movidos para cá (não cópias), então o histórico e os
  arquivos completos (src/, specs/, docs/) vieram junto.
- **Página individual de projeto (Semana 03) — não implementada**: o enunciado pede uma
  tela de detalhe por projeto ao clicar no card. Cheguei a implementar isso via troca de
  estado em `App.tsx` e testar localmente, mas o Enzo decidiu não seguir com esse
  requisito ("não precisa dessa tela intermediária") — a alteração foi revertida
  (`git checkout`) e o README da Entrega 3 documenta essa lacuna abertamente em vez de
  omitir.

## Última sessão (2026-09-19, Claude)

- Confirmado com Enzo que `frontend/entrega1-prototipo` (techX) e
  `frontend/entrega2-portifolio` pertencem a esta matéria; **movidos** para
  `entrega2-nocode-doc/` e `entrega3-portfolio/` (não apenas documentados à parte).
- Gerado o User Flow (Entrega 1) no FigJam via MCP do Figma (`generate_diagram`) a
  partir do fluxo de login + Pix do techX; permissão de link ainda pendente (ver acima).
- Tentativa de página individual de projeto no portfólio foi implementada, testada
  localmente e depois **revertida** a pedido do Enzo — não faz parte da entrega.
- READMEs de `entrega2-nocode-doc` e `entrega3-portfolio` reescritos combinando o
  conteúdo técnico original de cada projeto com as seções exigidas pelo enunciado
  (Sobre o projeto, Problema, Solução proposta, Telas, Figma / Apresentação, Stacks,
  Projetos).
- Nada foi commitado/enviado ao GitHub ainda.
