# Trilha: Interfaces dinâmicas e reativas

Cursos: **Noções básicas de React** (Meta) + **Aprenda CSS do Tailwind** (Scrimba).

## Componentes e JSX
No React, tudo é construído a partir de componentes (blocos reutilizáveis de UI) escritos com a sintaxe JSX, que mistura HTML dentro do JavaScript. Componentes podem ser importados dentro de outros para compor layouts.
```jsx
function Botao() {
  return <button className="p-2 bg-blue-500 text-white">Clique aqui</button>;
}
```

## Props (passagem de dados entre componentes)
Forma de um componente pai enviar dados para um componente filho, como parâmetros de função.
```jsx
function Saudacao({ nome }) {
  return <p>Olá, {nome}!</p>;
}
// uso: <Saudacao nome="Enzo" />
```

## Estado (state) e eventos
Dados internos de um componente que podem mudar com o tempo (`useState`) e reagem a ações do usuário (clique, digitação) por meio de manipuladores de evento.
```jsx
function Contador() {
  const [contagem, setContagem] = React.useState(0);
  return <button onClick={() => setContagem(contagem + 1)}>{contagem}</button>;
}
```

## Roteamento e navegação
Renderizar exibições diferentes conforme a URL do aplicativo (páginas/rotas), sem recarregar a página inteira, usando bibliotecas como React Router.
```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/sobre" element={<Sobre />} />
</Routes>
```

## Ativos (assets) e empacotamento
Como imagens, fontes e outros arquivos estáticos são importados nos componentes e agrupados pelo bundler do projeto (ex.: Webpack) para o app funcionar em produção.
```jsx
import logo from "./logo.png";
<img src={logo} alt="Logo" />
```

## Projeto prático: app de calculadora
Aplicação de componentes, estado e eventos juntos para montar uma calculadora funcional em React — botões que disparam eventos, atualizam o estado com o valor digitado e exibem o resultado.

## Classes utilitárias do Tailwind
Em vez de escrever CSS separado, o Tailwind estiliza direto na marcação usando classes utilitárias prontas para tamanho, cor, espaçamento (padding/margin).
```html
<div class="p-4 m-2 bg-blue-500 text-white rounded-lg">Cartão</div>
```

## Tipografia modular
Classes utilitárias específicas para controlar fonte, peso, tamanho e espaçamento de texto de forma consistente entre componentes.
```html
<h1 class="text-2xl font-bold tracking-wide">Título</h1>
```

## Layout responsivo com Flexbox
Uso das classes de Flexbox do Tailwind combinadas com prefixos de breakpoint para criar layouts que se adaptam ao tamanho da tela.
```html
<div class="flex flex-col md:flex-row gap-4">
  <div>Coluna 1</div>
  <div>Coluna 2</div>
</div>
```

## Modificadores (estados e responsividade)
Prefixos que aplicam uma classe só em certas condições, como hover do mouse ou a partir de um tamanho de tela específico.
```html
<button class="bg-blue-500 hover:bg-blue-700 sm:text-sm md:text-base">
  Enviar
</button>
```
