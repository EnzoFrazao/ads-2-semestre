// ===== Bloco 1 — Fundamentos e Variáveis =====

let pontos = 50;
pontos = pontos + 10;
console.log("Bloco 1 - pontos:", pontos);

const MAX_PONTOS = 100;
try {
  MAX_PONTOS = 200;
} catch (erro) {
  // const não pode ser reatribuída: o motor lança um TypeError em tempo de
  // execução (diferente de let/var, que aceitariam a nova atribuição).
  console.log("Bloco 1 - erro ao reatribuir const:", erro.constructor.name, "-", erro.message);
}

const texto = "Olá";
const numero = 42;
const booleano = true;
let indefinido;
const nulo = null;

console.log("Bloco 1 - tipos:", typeof texto, typeof numero, typeof booleano, typeof indefinido, typeof nulo);

const nomeJogador = "Maria";
const pontuacao = 95;
const fraseTemplate = `${nomeJogador} fez ${pontuacao} pontos!`;
const fraseConcatenacao = nomeJogador + " fez " + pontuacao + " pontos!";
console.log("Bloco 1 - template literal:", fraseTemplate);
console.log("Bloco 1 - concatenação:", fraseConcatenacao);

// ===== Bloco 2 — Funções =====

// Hoisting: funções declaradas sobem para o topo do escopo, então é
// possível chamar ehMaiorDeIdade antes da sua declaração no código.
console.log("Bloco 2 - chamada antes da declaração (hoisting):", ehMaiorDeIdade(20));

function ehMaiorDeIdade(idade) {
  return idade >= 18;
}

// Função de expressão: fica em uma "zona morta temporária" até a linha da
// const ser executada, então chamá-la antes gera ReferenceError.
try {
  console.log("Bloco 2 - chamada antes da expressão:", ehMaiorDeIdadeExpressao(20));
} catch (erro) {
  console.log("Bloco 2 - erro ao chamar antes da expressão:", erro.constructor.name, "-", erro.message);
}

const ehMaiorDeIdadeExpressao = function (idade) {
  return idade >= 18;
};
console.log("Bloco 2 - ehMaiorDeIdadeExpressao(20):", ehMaiorDeIdadeExpressao(20));

function dobroDeclarada(n) {
  return n * 2;
}
const dobroExpressao = function (n) {
  return n * 2;
};
const dobroArrow = (n) => n * 2;
console.log("Bloco 2 - dobro (declarada/expressão/arrow):", dobroDeclarada(4), dobroExpressao(4), dobroArrow(4));

const dobroComPadrao = (n = 1) => n * 2;
console.log("Bloco 2 - dobroComPadrao() sem argumento:", dobroComPadrao());
console.log("Bloco 2 - dobroComPadrao(5) com argumento:", dobroComPadrao(5));

// ===== Bloco 3 — Controle de Fluxo =====

function classificarNota(nota) {
  if (nota >= 6) {
    return "Aprovado";
  } else {
    return "Reprovado";
  }
}
console.log("Bloco 3 - classificarNota(7):", classificarNota(7));
console.log("Bloco 3 - classificarNota(4):", classificarNota(4));

const corSemaforo = "amarelo";
switch (corSemaforo) {
  case "vermelho":
    console.log("Bloco 3 - semáforo: Pare");
    break;
  case "amarelo":
    console.log("Bloco 3 - semáforo: Atenção");
    break;
  case "verde":
    console.log("Bloco 3 - semáforo: Siga");
    break;
  default:
    console.log("Bloco 3 - semáforo: cor desconhecida");
}

console.log("Bloco 3 - tabuada do 5:");
for (let i = 1; i <= 10; i++) {
  console.log(`  5 x ${i} = ${5 * i}`);
}

console.log("Bloco 3 - contagem regressiva:");
let contador = 5;
while (contador >= 1) {
  console.log(`  ${contador}`);
  contador--;
}

console.log("Bloco 3 - par/ímpar de 1 a 20 (for):");
for (let numeroAtual = 1; numeroAtual <= 20; numeroAtual++) {
  console.log(`  ${numeroAtual} é ${numeroAtual % 2 === 0 ? "par" : "ímpar"}`);
}

console.log("Bloco 3 - par/ímpar de 1 a 20 (while):");
let numeroAtualWhile = 1;
while (numeroAtualWhile <= 20) {
  console.log(`  ${numeroAtualWhile} é ${numeroAtualWhile % 2 === 0 ? "par" : "ímpar"}`);
  numeroAtualWhile++;
}

function diaDaSemana(numero) {
  switch (numero) {
    case 1:
      return "Domingo";
    case 2:
      return "Segunda-feira";
    case 3:
      return "Terça-feira";
    case 4:
      return "Quarta-feira";
    case 5:
      return "Quinta-feira";
    case 6:
      return "Sexta-feira";
    case 7:
      return "Sábado";
    default:
      return "Número inválido";
  }
}
console.log("Bloco 3 - diaDaSemana(4):", diaDaSemana(4));
console.log("Bloco 3 - diaDaSemana(9):", diaDaSemana(9));
