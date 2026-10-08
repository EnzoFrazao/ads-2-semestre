// ===== Parte 1 — Manipulação e Validação de Dados =====

const pedidos = [
  { cliente: "Bia", valor: 120, status: "pago" },
  { cliente: "", valor: 50, status: "pago" },
  { cliente: "Carlos", valor: -10, status: "pago" },
  { cliente: "Duda", valor: 80, status: "pendente" },
  { cliente: "Elton", valor: 200, status: "pago" },
];

function pedidoValido(pedido) {
  return pedido.cliente.trim() !== "" && typeof pedido.valor === "number" && pedido.valor > 0;
}

const pedidosValidos = pedidos.filter(pedidoValido);
const pedidosPagos = pedidosValidos.filter((pedido) => pedido.status === "pago");
const totalFaturado = pedidosPagos.reduce((acumulador, pedido) => acumulador + pedido.valor, 0);

console.log("Parte 1 - pedidos válidos:", pedidosValidos);
console.log("Parte 1 - pedidos pagos:", pedidosPagos);
console.log("Parte 1 - total faturado: R$", totalFaturado.toFixed(2));
pedidosPagos.forEach((pedido) => console.log(`Parte 1 - ${pedido.cliente} — R$ ${pedido.valor.toFixed(2)}`));

// ===== Parte 2 — Mini Projeto: Buscador de CEP =====

const formularioCep = document.querySelector("#formulario-cep");
const campoCep = document.querySelector("#campo-cep");
const botaoCep = document.querySelector("#botao-cep");
const statusCep = document.querySelector("#status-cep");
const resultadoCep = document.querySelector("#resultado-cep");
const historicoCepLista = document.querySelector("#historico-cep");
const historicoDeCeps = [];

function validarCep(cep) {
  const cepLimpo = cep.trim().replace(/\D/g, "");
  return /^\d{8}$/.test(cepLimpo) ? cepLimpo : null;
}

async function buscarCep(cep) {
  botaoCep.disabled = true;
  statusCep.textContent = "Buscando...";
  resultadoCep.replaceChildren();

  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
      signal: AbortSignal.timeout(5000),
    });

    if (!resposta.ok) {
      throw new Error(`Erro HTTP ${resposta.status}`);
    }

    const dados = await resposta.json();

    if (dados.erro) {
      statusCep.textContent = "CEP não encontrado";
      return;
    }

    const campos = [
      ["Rua", dados.logradouro],
      ["Bairro", dados.bairro],
      ["Cidade", dados.localidade],
      ["UF", dados.uf],
    ];
    const elementos = [];
    campos.forEach(([rotulo, valor]) => {
      const termo = document.createElement("dt");
      termo.textContent = rotulo;
      const descricao = document.createElement("dd");
      descricao.textContent = valor;
      elementos.push(termo, descricao);
    });
    resultadoCep.replaceChildren(...elementos);
    statusCep.textContent = "";

    historicoDeCeps.push({ cep, cidade: dados.localidade, uf: dados.uf });
    const itemHistorico = document.createElement("li");
    itemHistorico.textContent = `${cep} — ${dados.localidade}/${dados.uf}`;
    historicoCepLista.append(itemHistorico);
  } catch (erro) {
    statusCep.textContent = "Falha na conexão. Tente novamente.";
    console.log("Parte 2 - erro ao buscar CEP:", erro.message);
  } finally {
    botaoCep.disabled = false;
  }
}

formularioCep.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const cepValidado = validarCep(campoCep.value);
  if (!cepValidado) {
    statusCep.textContent = "CEP inválido: digite 8 dígitos numéricos.";
    return;
  }
  buscarCep(cepValidado);
});

// ===== Parte 3 — Tarefa de Casa: Desafio Mini Pokédex =====

const formularioPokemon = document.querySelector("#formulario-pokemon");
const campoPokemon = document.querySelector("#campo-pokemon");
const botaoPokemon = document.querySelector("#botao-pokemon");
const statusPokemon = document.querySelector("#status-pokemon");
const resultadoPokemon = document.querySelector("#resultado-pokemon");

async function buscarPokemon(nome) {
  botaoPokemon.disabled = true;
  statusPokemon.textContent = "Buscando...";
  resultadoPokemon.replaceChildren();

  try {
    const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nome}`, {
      signal: AbortSignal.timeout(5000),
    });

    if (!resposta.ok) {
      if (resposta.status === 404) {
        statusPokemon.textContent = "Pokémon não encontrado";
        return;
      }
      throw new Error(`Erro HTTP ${resposta.status}`);
    }

    const dados = await resposta.json();

    const nomeElemento = document.createElement("h3");
    nomeElemento.textContent = dados.name;

    const imagem = document.createElement("img");
    imagem.src = dados.sprites.front_default;
    imagem.alt = dados.name;

    const tipos = document.createElement("p");
    tipos.textContent = `Tipos: ${dados.types.map((tipo) => tipo.type.name).join(", ")}`;

    resultadoPokemon.replaceChildren(nomeElemento, imagem, tipos);
    statusPokemon.textContent = "";
  } catch (erro) {
    statusPokemon.textContent = "Falha na conexão. Tente novamente.";
    console.log("Parte 3 - erro ao buscar Pokémon:", erro.message);
  } finally {
    botaoPokemon.disabled = false;
  }
}

formularioPokemon.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const nome = campoPokemon.value.trim().toLowerCase();
  if (nome === "") {
    statusPokemon.textContent = "Digite o nome de um Pokémon.";
    return;
  }
  buscarPokemon(nome);
});
