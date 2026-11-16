import { DAILY, END, MESES, SEAS, addDays, dowOf } from './daily'
import { mensal } from './metrics'

// 18 meses a partir de nov/2025: 12 reais (até out/2026) e 6 previstos
export const chavesMes = (n = 18) =>
  Array.from({ length: n }, (_, i) => {
    const total = 10 + i
    const ano = 2025 + Math.floor(total / 12)
    const mes = total % 12
    return { chave: `${ano}-${String(mes + 1).padStart(2, '0')}`, label: `${MESES[mes]}/${String(ano).slice(2)}` }
  })

const PIZZAS_POR_PEDIDO = 1.45
const MARGEM_MASSA = 1.05

// Previsão simples e transparente: média por dia da semana das últimas 8 semanas,
// com crescimento de 1% por semana e ajuste sazonal. Não é um modelo estatístico.
export function previsaoPedidos(dias = 14) {
  const ini = addDays(END, -55)
  const soma = { h: Array(7).fill(0), r: Array(7).fill(0) }
  const cnt = { h: Array(7).fill(0), r: Array(7).fill(0) }
  for (const r of DAILY) {
    if (r.date < ini) continue
    soma[r.loja][r.dow] += r.pedidos
    cnt[r.loja][r.dow] += 1
  }
  const media = (l, d) => soma[l][d] / cnt[l][d]
  const mesBase = Number(END.slice(5, 7)) - 1
  const saida = []
  for (let k = 1; k <= dias; k++) {
    const date = addDays(END, k)
    const dow = dowOf(date)
    const mes = Number(date.slice(5, 7)) - 1
    const f = (1 + 0.01 * (k / 7)) * (SEAS[mes] / SEAS[mesBase])
    const h = Math.round(media('h', dow) * f)
    const r = Math.round(media('r', dow) * f)
    saida.push({
      date,
      dow,
      h,
      r,
      total: h + r,
      massasH: Math.ceil(h * PIZZAS_POR_PEDIDO * MARGEM_MASSA),
      massasR: Math.ceil(r * PIZZAS_POR_PEDIDO * MARGEM_MASSA),
    })
  }
  return saida
}

// Faturamento mensal: 12 meses reais (nov/25 a out/26) + 6 meses previstos (nov/26 a abr/27)
export function faturamentoMensal(loja) {
  const m = mensal(loja, 'bruto')
  const chaves = []
  for (let i = 0; i < 18; i++) {
    const total = 10 + i // índice a partir de nov/2025 (mês 10 de 2025)
    const ano = 2025 + Math.floor(total / 12)
    const mes = (total % 12) + 1
    chaves.push(`${ano}-${String(mes).padStart(2, '0')}`)
  }
  const soma4 = (ano) => ['07', '08', '09', '10'].reduce((a, mm) => a + (m[`${ano}-${mm}`] || 0), 0)
  const yoy = soma4(2026) / soma4(2025)
  const anoAnt = (k) => `${Number(k.slice(0, 4)) - 1}${k.slice(4)}`
  return {
    yoy: (yoy - 1) * 100,
    itens: chaves.map((k, i) => ({
      chave: k,
      futuro: i >= 12,
      valor: i >= 12 ? (m[anoAnt(k)] || 0) * yoy : m[k] || 0,
      anterior: m[anoAnt(k)] || 0,
    })),
  }
}
