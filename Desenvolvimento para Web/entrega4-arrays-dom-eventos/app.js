// ===== Bloco 1 — Arrays e Métodos (map, filter, reduce, forEach) =====

const nomes = ["Ana", "Bruno", "Carla"];
nomes.forEach((nome) => console.log(`Olá, ${nome}!`));
const nomesMaiusculos = nomes.map((nome) => nome.toUpperCase());
console.log("Bloco 1 - nomes em maiúsculas:", nomesMaiusculos);

const precos = [10, 25, 40, 5, 60];
const precosAcimaDe20 = precos.filter((preco) => preco > 20);
const somaPrecos = precos.reduce((acumulador, preco) => acumulador + preco, 0);
console.log("Bloco 1 - preços acima de 20:", precosAcimaDe20);
console.log("Bloco 1 - soma de todos os preços:", somaPrecos);

const produtos = [
  { nome: "Caderno", preco: 15 },
  { nome: "Mochila", preco: 120 },
  { nome: "Caneta", preco: 3 },
  { nome: "Estojo", preco: 45 },
];
const nomesDosProdutos = produtos.map((produto) => produto.nome);
const produtosAbaixoDe50 = produtos.filter((produto) => produto.preco < 50);
const somaDosPrecos = produtos.reduce((acumulador, produto) => acumulador + produto.preco, 0);
console.log("Bloco 1 - nomes dos produtos:", nomesDosProdutos);
console.log("Bloco 1 - produtos com preço < 50:", produtosAbaixoDe50);
console.log("Bloco 1 - soma dos preços dos produtos:", somaDosPrecos);
produtos.forEach((produto) => console.log(`Bloco 1 - Nome: ${produto.nome} R$ ${produto.preco}`));

// ===== Bloco 2 — Manipulação do DOM =====

const titulo = document.querySelector("#titulo");
titulo.textContent = "Blog do Enzo Frazão";

const paragrafos = document.querySelectorAll(".texto");
paragrafos.forEach((paragrafo) => console.log("Bloco 2 - parágrafo:", paragrafo.textContent));

const lista = document.querySelector("#lista");
lista.innerHTML += "<li>Item inserido via innerHTML A</li><li>Item inserido via innerHTML B</li>";

const terceiroItem = document.createElement("li");
terceiroItem.textContent = "Terceiro item";
lista.append(terceiroItem);

terceiroItem.classList.add("destaque");
console.log("Bloco 2 - terceiroItem tem a classe destaque?", terceiroItem.classList.contains("destaque"));

const tarefas = ["Estudar JS", "Fazer exercícios", "Revisar DOM"];
tarefas.forEach((tarefa) => {
  const itemTarefa = document.createElement("li");
  itemTarefa.textContent = tarefa;
  lista.append(itemTarefa);
});
lista.querySelector("li").classList.add("feito");
console.log("Bloco 2 - quantidade total de itens na lista:", document.querySelectorAll("li").length);

// ===== Bloco 3 — Eventos e Event Delegation =====

const botao = document.querySelector("#botao");
botao.addEventListener("click", () => console.log("Clicou!"));
botao.addEventListener("mouseover", () => {
  botao.textContent = "Pode clicar!";
});

const campoNome = document.querySelector("#nome");
campoNome.addEventListener("keyup", () => console.log("Bloco 3 - campo nome:", campoNome.value));

// Event delegation: um único listener no <ul>, não um em cada <li> — assim
// qualquer item, inclusive os criados dinamicamente depois, já funciona.
lista.addEventListener("click", (evento) => {
  if (evento.target.tagName === "LI") {
    evento.target.classList.toggle("feito");
    console.log("Bloco 3 - clique delegado no item:", evento.target.textContent);
  }
});

const itemCriadoDepois = document.createElement("li");
itemCriadoDepois.textContent = "Item criado depois (também recebe o clique delegado)";
lista.append(itemCriadoDepois);

const formulario = document.querySelector("#formulario");
const campoTarefa = document.querySelector("#tarefa");
formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const texto = campoTarefa.value.trim();
  if (texto === "") {
    return;
  }
  const novoItem = document.createElement("li");
  novoItem.textContent = texto;
  lista.append(novoItem);
  campoTarefa.value = "";
});
