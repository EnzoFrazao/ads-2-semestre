# ADS · 2º semestre

> **EN:** Coursework from the second semester of my Systems Analysis and Development degree (2026):
> Python fundamentals through OOP, web fundamentals through async APIs and React, and a UX track
> that ends in a mobile banking prototype (React + TypeScript, 13 screens) and a personal portfolio.

Entregas das disciplinas do 2º semestre de **Análise e Desenvolvimento de Sistemas**, em 2026. Cada
disciplina é uma pasta, e cada entrega é uma subpasta `entregaN-tema/` ou `desafio-tema/`.

<div align="center">
  <img src="Design%20de%20Experi%C3%AAncia%20e%20Prototipa%C3%A7%C3%A3o/entrega2-prototipo/docs/screens/02-inicio.png" width="24%" alt="techX: tela inicial com saldo">
  <img src="Design%20de%20Experi%C3%AAncia%20e%20Prototipa%C3%A7%C3%A3o/entrega2-prototipo/docs/screens/05-pix-hub.png" width="24%" alt="techX: hub do Pix">
  <img src="Design%20de%20Experi%C3%AAncia%20e%20Prototipa%C3%A7%C3%A3o/entrega2-prototipo/docs/screens/08-pix-confirmar.png" width="24%" alt="techX: confirmação do Pix">
  <img src="Design%20de%20Experi%C3%AAncia%20e%20Prototipa%C3%A7%C3%A3o/entrega2-prototipo/docs/screens/10-comprovante.png" width="24%" alt="techX: comprovante do Pix">
  <br><sub>techX: protótipo de banco digital da disciplina de UX (entrega 2)</sub>
</div>

## Destaques

| Projeto | O que é | Stack |
|---|---|---|
| [**techX: banco digital**](Design%20de%20Experi%C3%AAncia%20e%20Prototipa%C3%A7%C3%A3o/entrega2-prototipo/) | Protótipo mobile com 13 telas: saldo, extrato com filtros, Pix de ponta a ponta com comprovante, cartões e notificações. Começou como wireframe do Figma Make e foi reescrito com rotas, tipos, estados de carregamento e design system | React 18, TypeScript, Vite, Tailwind 4 |
| [**User flow do Pix**](Design%20de%20Experi%C3%AAncia%20e%20Prototipa%C3%A7%C3%A3o/entrega1-userflow/) | Fluxo de login e envio de Pix com os pontos de decisão (senha, chave, saldo e aprovação) e os caminhos de erro | FigJam, SVG |
| [**Portfólio pessoal**](Design%20de%20Experi%C3%AAncia%20e%20Prototipa%C3%A7%C3%A3o/entrega3-portfolio/) | SPA com estética de terminal, publicada pelo Figma Make | React 19, TypeScript, Vite, Tailwind 4 |
| [**Sistema bancário em POO**](Desenvolvimento%20em%20Python/entrega6-poo-sistema-bancario/) | Herança, classe abstrata, `@property` com validação e polimorfismo, com diagrama de classes | Python |
| [**CEP e Pokédex assíncronos**](Desenvolvimento%20para%20Web/entrega5-apis-assincronismo/) | `fetch` + `async/await` com os quatro estados de tela, timeout e proteção contra XSS | JavaScript, ViaCEP, PokéAPI |

## Desenvolvimento em Python

| Entrega | Tema | Destaque |
|---|---|---|
| [entrega1-fundamentos](Desenvolvimento%20em%20Python/entrega1-fundamentos/) | Variáveis, entrada e saída, operadores | 6 desafios (troco, média, conversor de tempo, desconto, par ou ímpar, inversor de nome) |
| [entrega2-estruturas-controle](Desenvolvimento%20em%20Python/entrega2-estruturas-controle/) | `if`, laços, menus | Cada desafio em Python e em **Portugol** (`.por`), para comparar a lógica |
| [entrega3-modularizacao](Desenvolvimento%20em%20Python/entrega3-modularizacao/) | Funções e módulos | Calculadora, estatística e utilidades importadas por um script principal |
| [entrega4-estruturas-dados](Desenvolvimento%20em%20Python/entrega4-estruturas-dados/) | Listas, dicionários, conjuntos | Cadastro de produtos com filtro, ordenação, categorias únicas e estatísticas |
| [entrega5-arquivos-regex-excecoes](Desenvolvimento%20em%20Python/entrega5-arquivos-regex-excecoes/) | CSV, regex, exceções | Validação de e-mail, CPF, telefone e data, com exceção personalizada |
| [entrega6-poo-sistema-bancario](Desenvolvimento%20em%20Python/entrega6-poo-sistema-bancario/) | Orientação a objetos | Diagrama de classes e justificativa de cada decisão de modelagem |
| [desafio-labirinto](Desenvolvimento%20em%20Python/desafio-labirinto/) | Recursão | Resolve um labirinto por *backtracking* recursivo, imprimindo cada passo da trilha até a saída |

## Desenvolvimento para Web

| Entrega | Tema | Destaque |
|---|---|---|
| [entrega1-estrutura-formulario](Desenvolvimento%20para%20Web/entrega1-estrutura-formulario/) | HTML semântico | Blog com artigos e formulário de inscrição na newsletter |
| [entrega2-estilizacao-formulario](Desenvolvimento%20para%20Web/entrega2-estilizacao-formulario/) | CSS | A mesma página, estilizada |
| [entrega3-javascript-fundamentos](Desenvolvimento%20para%20Web/entrega3-javascript-fundamentos/) | JavaScript básico | Variáveis, funções e controle de fluxo, com comentários explicando cada comportamento |
| [entrega4-arrays-dom-eventos](Desenvolvimento%20para%20Web/entrega4-arrays-dom-eventos/) | Arrays e DOM | `map`/`filter`/`reduce` e *event delegation* |
| [entrega5-apis-assincronismo](Desenvolvimento%20para%20Web/entrega5-apis-assincronismo/) | APIs e `async/await` | ViaCEP e PokéAPI com estados de carregando, erro, vazio e sucesso |
| [desafio-vite-componentes-reutilizaveis](Desenvolvimento%20para%20Web/desafio-vite-componentes-reutilizaveis/) | React | Componentes `Header` e `Card` reutilizados com props |

## Design de Experiência e Prototipação

| Entrega | Tema | Destaque |
|---|---|---|
| [entrega1-userflow](Design%20de%20Experi%C3%AAncia%20e%20Prototipa%C3%A7%C3%A3o/entrega1-userflow/) | User flow | Fluxo do Pix com decisões e caminhos de erro |
| [entrega2-prototipo](Design%20de%20Experi%C3%AAncia%20e%20Prototipa%C3%A7%C3%A3o/entrega2-prototipo/) | Protótipo | techX, 13 telas, mapa de navegação e design system |
| [entrega3-portfolio](Design%20de%20Experi%C3%AAncia%20e%20Prototipa%C3%A7%C3%A3o/entrega3-portfolio/) | Portfólio | Prototipado no Figma Make e exportado em React |

## Como rodar

- **Python:** `python <arquivo>.py` dentro da pasta da entrega (Python 3.10 ou mais novo).
- **Web (entregas 1 a 5):** abra o `index.html` no navegador. Nas entregas 3 a 5, deixe o Console
  aberto (F12).
- **React (desafio Vite, techX, portfólio):** instale as dependências na pasta do projeto (`npm install`,
  ou `pnpm install` no portfólio, que usa pnpm) e rode `npm run dev`. O README de cada um traz os detalhes.
