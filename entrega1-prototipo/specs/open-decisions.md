# Decisões em aberto

Questões sem resposta. Não inventar solução aqui — registrar e decidir com o dono.

## 1. O domínio do app foi escolhido pela IA, não pelo autor

O prompt original no Figma Make não dizia qual era o app. O Make perguntou
*"qual é o app e o texto que devo usar?"*, a resposta foi "pode criar um exemplo
com um app de sua escolha", e ele escolheu finanças/Pix.

Em 2026-08-20 foi confirmado **manter finanças**. Fica registrado porque, se o
trabalho acadêmico ("techX" / oxygeni) tiver um tema próprio, todo o conteúdo das
13 telas precisa ser retematizado — a estrutura serve, a copy não.

## 2. Onde os dados vão morar

`src/data/mock.ts` é fonte única, mas não há definição sobre backend: API própria,
BaaS, ou seguir com mock para a entrega. O ponto de troca já está isolado
(`useAsyncData`), mas o formato do contrato de API não existe.

## 3. Login é fachada

A tela aceita qualquer senha de 6 dígitos e não guarda sessão. Não foi decidido se
o escopo do trabalho exige autenticação real ou se a fachada basta.

## 4. Publicação

O `vite.config.ts` usa `base: "./"` e o router é `HashRouter`, então o `dist/`
funciona em GitHub Pages. Mas **não foi decidido se o projeto será publicado**, nem
se haverá workflow de deploy. Nada de CI existe hoje.

## 5. O arquivo do Figma continua divergindo

O Figma Make (fileKey `NdDqbymWZZKF6Jm1O49iof`) segue na v4 e não recebeu nada do
que foi feito aqui. Em 2026-08-20 decidiu-se **não publicar no Figma** — a cota de
chamadas MCP do plano Starter estava esgotada e a conta está com seat "View".
Se o Figma voltar a ser fonte de verdade do design, o arquivo precisa ser
reconciliado ou marcado como obsoleto.
