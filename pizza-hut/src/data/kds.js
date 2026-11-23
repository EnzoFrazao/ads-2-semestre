import { DAILY, END, META_ENTREGA, addDays } from './daily'

// Etapas do KDS (sistema de monitoramento de pedidos), na ordem do fluxo. Cada "ok" no tablet da
// etapa registra o horário, então dá para separar onde o pedido esperou. A soma das metas é a meta
// de despacho da franqueadora. Análise sempre por etapa (e dia), nunca por pessoa.
export const ETAPAS = [
  { id: 'montagem', nome: 'Montagem', meta: 4.5, onde: 'Make: monta a pizza e dá o ok no telão' },
  { id: 'forno', nome: 'Forno', meta: 7, onde: 'Esteira do forno, cerca de 7 min', fixa: true },
  { id: 'porta', nome: 'Corte e caixa', meta: 1.5, onde: 'Porta: corta, coloca na caixa e dá o ok' },
  { id: 'despacho', nome: 'Despacho', meta: 2, onde: 'Delivery: confere, junta bebida e sacola' },
]

export const META_ETAPAS = ETAPAS.reduce((a, e) => a + e.meta, 0)
if (META_ETAPAS !== META_ENTREGA) throw new Error('A soma das metas por etapa precisa bater com a meta de despacho')

// Tolerância antes de a etapa ficar vermelha, em minutos acima da meta dela
export const TOLERANCIA_ETAPA = 1

export function nivelEtapa(valor, meta) {
  if (valor <= meta) return 'ok'
  return valor - meta <= TOLERANCIA_ETAPA ? 'warn' : 'bad'
}

// Nível do tempo total de despacho: até a meta é ok; até 5 min acima é atenção; acima disso, crítico.
export function nivelDespacho(valor) {
  if (valor <= META_ENTREGA) return 'ok'
  return valor <= META_ENTREGA + 5 ? 'warn' : 'bad'
}

// Média ponderada por pedidos de cada etapa. Linhas sem KDS (campos nulos) são ignoradas.
export function mediaEtapas(rows) {
  const com = rows.filter((r) => r.montagem != null)
  const p = com.reduce((a, r) => a + r.pedidos, 0) || 1
  const out = {}
  for (const e of ETAPAS) out[e.id] = com.reduce((a, r) => a + r[e.id] * r.pedidos, 0) / p
  out.total = ETAPAS.reduce((a, e) => a + out[e.id], 0)
  return out
}

// Média por dia da semana (Seg..Dom) de cada etapa: matriz etapa x dia
export function etapaPorDia(rows) {
  const com = rows.filter((r) => r.montagem != null)
  return ETAPAS.map((e) =>
    Array.from({ length: 7 }, (_, d) => {
      const g = com.filter((r) => r.dow === d)
      const p = g.reduce((a, r) => a + r.pedidos, 0)
      return p ? g.reduce((a, r) => a + r[e.id] * r.pedidos, 0) / p : null
    }),
  )
}

// Etapa que mais passou da meta (diferença em minutos)
export function maiorGargalo(medias) {
  return ETAPAS.map((e) => ({ ...e, valor: medias[e.id], excesso: medias[e.id] - e.meta })).sort((a, b) => b.excesso - a.excesso)[0]
}

const mediana = (arr) => {
  const s = [...arr].sort((a, b) => a - b)
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}

// Dias seguidos em que o tempo de despacho ficou muito acima do normal da loja (1,6x a mediana de 90 dias).
// Um salto assim, em todas as etapas ou concentrado numa só, costuma ser equipamento (monitor do KDS,
// cabo, rede) antes de ser problema de equipe, então o painel pede para checar isso primeiro.
export function ocorrencias(loja = 'h', dias = 28) {
  const base = DAILY.filter((r) => r.loja === loja && r.date > addDays(END, -90))
  const limite = mediana(base.map((r) => r.tempo)) * 1.6
  const ini = addDays(END, -(dias - 1))
  const fora = DAILY.filter((r) => r.loja === loja && r.date >= ini && r.tempo > limite).sort((a, b) => (a.date < b.date ? -1 : 1))
  const grupos = []
  for (const r of fora) {
    const ult = grupos[grupos.length - 1]
    if (ult && addDays(ult.fim, 1) === r.date) {
      ult.fim = r.date
      ult.dias += 1
      ult.pico = Math.max(ult.pico, r.tempo)
      ult.linhas.push(r)
    } else grupos.push({ ini: r.date, fim: r.date, dias: 1, pico: r.tempo, linhas: [r], limite })
  }
  return grupos.map((g) => {
    const med = mediaEtapas(g.linhas)
    const e = maiorGargalo(med)
    return { ...g, etapa: e.nome, normal: limite / 1.6 }
  })
}
