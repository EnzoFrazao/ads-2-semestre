import { DAILY, END, addDays, dowOf } from './daily'
import { dataCurta } from './format'

// Janelas em múltiplos de 7 dias: cada período tem os mesmos dias da semana que o anterior,
// então a variação não é distorcida por ter mais sábados ou mais segundas.
export const PERIODOS = {
  '7d': { dias: 7, label: '7 dias' },
  '30d': { dias: 28, label: '4 semanas' },
  '90d': { dias: 91, label: '13 semanas' },
  '12m': { dias: 364, label: '12 meses' },
}

export function janela(periodo, offset = 0) {
  const n = PERIODOS[periodo].dias
  const fim = addDays(END, -n * offset)
  return { ini: addDays(fim, -(n - 1)), fim }
}

export function selecionar(loja, periodo, offset = 0) {
  const { ini, fim } = janela(periodo, offset)
  return DAILY.filter((r) => r.date >= ini && r.date <= fim && (loja === 'all' || r.loja === loja))
}

const mediana = (arr) => {
  if (!arr.length) return 0
  const s = [...arr].sort((a, b) => a - b)
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}

export function somar(rows) {
  const s = {
    pedidos: 0,
    bruto: 0,
    descontos: 0,
    taxas: 0,
    liquido: 0,
    desperdicio: 0,
    cmvValor: 0,
    canal: { salao: 0, ifood: 0, balcao: 0, app: 0 },
  }
  let tempoW = 0
  let dentroW = 0
  let notaW = 0
  let cancelW = 0
  let acordoW = 0
  for (const r of rows) {
    s.pedidos += r.pedidos
    s.bruto += r.bruto
    s.descontos += r.descontos
    s.taxas += r.taxas
    s.liquido += r.liquido
    s.desperdicio += r.desperdicio
    s.cmvValor += r.cmvValor
    for (const k of Object.keys(s.canal)) s.canal[k] += r.canal[k]
    tempoW += r.tempo * r.pedidos
    dentroW += r.dentro * r.pedidos
    notaW += r.nota * r.pedidos
    cancelW += r.cancel * r.pedidos
    acordoW += r.acordo * r.pedidos
  }
  const p = s.pedidos || 1
  s.ticket = s.bruto / p
  s.cmv = s.bruto ? (s.cmvValor / s.bruto) * 100 : 0
  s.tempo = tempoW / p
  s.tempoMediana = mediana(rows.map((r) => r.tempo))
  s.dentro = dentroW / p
  s.atrasos = 100 - s.dentro
  s.nota = notaW / p
  s.cancel = cancelW / p
  s.acordo = acordoW / p
  s.despPct = s.bruto ? (s.desperdicio / s.bruto) * 100 : 0
  return s
}

export const variacao = (atual, anterior) => (anterior ? ((atual - anterior) / anterior) * 100 : 0)

// Início da semana (segunda) de uma data
const semanaDe = (iso) => addDays(iso, -dowOf(iso))

// Série temporal por loja. Em 12 meses agrupa por semana para o gráfico respirar.
export function serie(rows, fn, periodo) {
  const semanal = periodo === '12m'
  const chave = (r) => (semanal ? semanaDe(r.date) : r.date)
  const datas = [...new Set(rows.map(chave))].sort()
  const porLoja = (loja) =>
    datas.map((d) => {
      const g = rows.filter((r) => r.loja === loja && chave(r) === d)
      return g.length ? fn(g) : null
    })
  return { datas, labels: datas.map(dataCurta), h: porLoja('h'), r: porLoja('r') }
}

export const somaCampo = (campo) => (g) => g.reduce((a, r) => a + r[campo], 0)
export const mediaPond = (campo) => (g) => {
  const p = g.reduce((a, r) => a + r.pedidos, 0) || 1
  return g.reduce((a, r) => a + r[campo] * r.pedidos, 0) / p
}

// Média por dia da semana (Seg..Dom) de um campo somado por dia
export function porDiaSemana(rows, campo) {
  const res = { h: Array(7).fill(0), r: Array(7).fill(0) }
  const cnt = { h: Array(7).fill(0), r: Array(7).fill(0) }
  for (const r of rows) {
    res[r.loja][r.dow] += r[campo]
    cnt[r.loja][r.dow] += 1
  }
  for (const l of ['h', 'r']) res[l] = res[l].map((v, i) => (cnt[l][i] ? v / cnt[l][i] : null))
  return res
}

// Soma por mês ("2026-03") de um campo, por loja
export function mensal(loja, campo = 'bruto') {
  const out = {}
  for (const r of DAILY) {
    if (loja !== 'all' && r.loja !== loja) continue
    const k = r.date.slice(0, 7)
    out[k] = (out[k] || 0) + r[campo]
  }
  return out
}
