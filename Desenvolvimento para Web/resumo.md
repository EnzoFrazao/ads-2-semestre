# Trilha: Desenvolvimento para Web

Cursos: **Noções básicas de JavaScript** (UC Davis) + **Introdução a HTML, CSS e JavaScript** (IBM).

## Papéis do desenvolvimento web
Diferença entre front-end (o que o usuário vê e interage), back-end (servidor, dados) e full stack (os dois), e como esses papéis colaboram num projeto.

## Ferramentas e ambiente de desenvolvimento
Uso de um editor de código (ex.: VS Code) e de editores on-line como o JSFiddle para escrever, testar e depurar HTML/CSS/JS rapidamente, além do console do navegador para rodar comandos JavaScript diretamente.
Exemplo: abrir o DevTools do navegador (F12), digitar `console.log("teste")` na aba Console e ver o resultado na hora.

## Estrutura de página com HTML5
Elementos estruturais semânticos (`header`, `footer`, `section`, `article`) e controles de formulário (`input`, `fieldset`, `legend`) para organizar o conteúdo de uma página.
```html
<header>Meu Site</header>
<section>
  <article>Conteúdo do post</article>
</section>
<footer>© 2026</footer>
```

## Estilização com CSS
Seletores, classes e IDs para aplicar estilo, layout com Flexbox, e frameworks prontos como Bootstrap/Tailwind para responsividade.
```css
.card { display: flex; justify-content: space-between; }
#titulo { color: #333; font-weight: bold; }
```

## Variáveis, arrays e tipos de dados em JavaScript
Como declarar variáveis (`let`, `const`) e arrays (matrizes) e atribuir/ler valores delas.
```javascript
let nome = "Enzo";
const idades = [20, 25, 30];
idades.push(35);
```

## Estruturas de controle: seleção e repetição
As três estruturas de fluxo lógico de qualquer linguagem: sequência, seleção (`if/else`) e repetição (loops), usadas para o programa tomar decisões e repetir tarefas.
```javascript
for (let i = 0; i < idades.length; i++) {
  if (idades[i] >= 18) {
    console.log(idades[i] + " é maior de idade");
  }
}
```

## Funções
Agrupar um conjunto de instruções num bloco nomeado e reutilizável, que pode receber parâmetros e retornar um valor.
```javascript
function saudacao(nome) {
  return "Olá, " + nome + "!";
}
```

## Objetos e protótipos em JavaScript
Objetos guardam dados e comportamento juntos; o JavaScript usa herança baseada em protótipos, onde um objeto pode herdar propriedades e métodos de outro em vez de usar classes tradicionais.
```javascript
const animal = { som() { return "..."; } };
const cachorro = Object.create(animal);
cachorro.latir = function () { return "Au au!"; };
console.log(cachorro.som());  // herdado do protótipo "animal"
```

## Manipulação do DOM e eventos
Usar JavaScript para acessar e alterar elementos HTML já carregados na página (Document Object Model) e reagir a ações do usuário (clique, envio de formulário) capturando eventos.
```javascript
document.querySelector("#botao").addEventListener("click", () => {
  document.querySelector("#titulo").textContent = "Clicado!";
});
```

## Escopo de variáveis
Onde uma variável pode ser acessada dentro do código (global vs. dentro de uma função/bloco), evitando que variáveis se sobrescrevam sem querer.
```javascript
function exemplo() {
  let local = 10; // só existe dentro da função
}
console.log(typeof local); // "undefined" fora da função
```

## Projeto final: página de portfólio
Combinar tudo (estrutura HTML, estilo CSS, interatividade JS) para montar uma página real, como um portfólio profissional estático com validação de formulário e conteúdo dinâmico.
