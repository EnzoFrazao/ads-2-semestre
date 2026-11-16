import { mulberry32 } from './rng'

// Equipe fictícia e anonimizada. A pontuação compara SOMENTE pessoas da mesma função e já
// considera volume. Bonificação é só proposta: depende de validação do gestor (briefing 5.4).

export const FUNCOES = {
  cozinha: {
    label: 'Cozinha',
    metricas: [
      { k: 'pizzasHora', label: 'Pizzas por hora', peso: 0.35, maior: true, un: '' },
      { k: 'erro', label: 'Erros de preparo (%)', peso: 0.3, maior: false, un: '%' },
      { k: 'preparo', label: 'Tempo de preparo (min)', peso: 0.2, maior: false, un: ' min' },
      { k: 'perda', label: 'Perda individual (%)', peso: 0.15, maior: false, un: '%' },
    ],
  },
  atendimento: {
    label: 'Atendimento',
    metricas: [
      { k: 'pedidosHora', label: 'Pedidos por hora', peso: 0.3, maior: true, un: '' },
      { k: 'notaCliente', label: 'Nota dos clientes', peso: 0.4, maior: true, un: '' },
      { k: 'erroPedido', label: 'Erros de pedido (%)', peso: 0.3, maior: false, un: '%' },
    ],
  },
  entrega: {
    label: 'Entregadores',
    metricas: [
      { k: 'entregasHora', label: 'Entregas por hora', peso: 0.25, maior: true, un: '' },
      { k: 'noPrazo', label: 'Entregas no prazo (%)', peso: 0.4, maior: true, un: '%' },
      { k: 'notaCliente', label: 'Nota dos clientes', peso: 0.25, maior: true, un: '' },
      { k: 'ocorrencias', label: 'Ocorrências no mês', peso: 0.1, maior: false, un: '' },
    ],
  },
}

const rnd = mulberry32(4242)
const entre = (a, b) => a + (b - a) * rnd()
const r1 = (v) => Math.round(v * 10) / 10
const r2 = (v) => Math.round(v * 100) / 100

const TURNOS = ['Almoço', 'Noite']

function criar() {
  const lista = []
  const add = (funcao, nome, loja, gen) => {
    const turno = TURNOS[Math.floor(rnd() * 2)]
    lista.push({ id: `${funcao}-${nome}`, funcao, nome, loja, turno, ...gen() })
  }
  const pessoas = {
    cozinha: [['Pizzaiolo A', 'h'], ['Pizzaiolo B', 'h'], ['Pizzaiolo C', 'h'], ['Pizzaiolo D', 'r'], ['Pizzaiolo E', 'r']],
    atendimento: [['Atendente A', 'h'], ['Atendente B', 'h'], ['Atendente C', 'h'], ['Atendente D', 'h'], ['Atendente E', 'r']],
    entrega: [['Motoboy A', 'r'], ['Motoboy B', 'r'], ['Motoboy C', 'r'], ['Motoboy D', 'r'], ['Motoboy E', 'r'], ['Motoboy F', 'r']],
  }
  for (const [n, l] of pessoas.cozinha)
    add('cozinha', n, l, () => ({
      volume: Math.round(entre(900, 1900)),
      pizzasHora: r1(entre(14, 24)),
      erro: r1(entre(0.8, 3.4)),
      preparo: r1(entre(9, 14)),
      perda: r1(entre(0.8, 2.6)),
    }))
  for (const [n, l] of pessoas.atendimento)
    add('atendimento', n, l, () => ({
      volume: Math.round(entre(1200, 2600)),
      pedidosHora: r1(entre(11, 19)),
      notaCliente: r2(entre(4.4, 4.95)),
      erroPedido: r1(entre(0.5, 3.0)),
    }))
  for (const [n, l] of pessoas.entrega)
    add('entrega', n, l, () => ({
      volume: Math.round(entre(260, 520)),
      entregasHora: r1(entre(2.2, 3.6)),
      noPrazo: r1(entre(78, 96)),
      notaCliente: r2(entre(4.4, 4.95)),
      ocorrencias: Math.round(entre(0, 5)),
    }))
  return lista
}

function pontuar(lista) {
  for (const f of Object.keys(FUNCOES)) {
    const grupo = lista.filter((p) => p.funcao === f)
    const ms = FUNCOES[f].metricas
    for (const m of ms) {
      const v = grupo.map((p) => p[m.k])
      m.min = Math.min(...v)
      m.max = Math.max(...v)
      m.media = v.reduce((a, b) => a + b, 0) / v.length
    }
    const volumes = grupo.map((p) => p.volume).sort((a, b) => a - b)
    const medianaVol = volumes[Math.floor(volumes.length / 2)]
    for (const p of grupo) {
      let s = 0
      for (const m of ms) {
        const n = m.max === m.min ? 0.5 : (p[m.k] - m.min) / (m.max - m.min)
        s += m.peso * (m.maior ? n : 1 - n)
      }
      p.score = Math.round(40 + s * 60) // 40 a 100: evita zerar quem não é o último
      p.volumeOk = p.volume >= medianaVol
    }
    const ordenado = [...grupo].sort((a, b) => b.score - a.score)
    ordenado.forEach((p, i) => {
      p.posicao = i + 1
      p.proposta = p.score >= 80 && p.volumeOk
    })
  }
  return lista
}

export const EQUIPE = pontuar(criar())
