import { clamp, mulberry32 } from './rng'

// Todos os números deste protótipo são FICTÍCIOS, gerados com semente fixa e calibrados
// com as faixas do briefing (CMV 28%–32%, nota iFood 4,7+, cancelamento <1%, acordo <2,5%).

export const START = '2024-10-01'
export const END = '2026-11-10' // último dia fechado; a carga de "hoje" é 11/11/2026 às 08:02
export const ULTIMA_CARGA = { data: '2026-11-11', hora: '08:02' }

export const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
export const DIAS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
// Meta da franqueadora: do pedido cair na central até o motoboy sair (despacho). Hoje a loja faz ~19 min.
// O tempo até o cliente só existe para o motoboy do iFood; a cooperativa não informa.
export const META_ENTREGA = 15 // minutos
export const MIN_MOTOBOYS = 10 // sexta a domingo, Renascença
export const CMV_MIN = 28
export const CMV_MAX = 32

export const LOJAS = {
  h: { id: 'h', nome: 'Holandeses', tipo: 'Salão', detalhe: 'Salão, 3 andares' },
  r: { id: 'r', nome: 'Renascença', tipo: 'Delivery', detalhe: 'Delivery, pico de sexta a domingo' },
}

export const addDays = (iso, n) => {
  const d = new Date(`${iso}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}
export const dowOf = (iso) => (new Date(`${iso}T00:00:00Z`).getUTCDay() + 6) % 7 // 0 = segunda
export const diffDays = (a, b) => Math.round((new Date(`${b}T00:00:00Z`) - new Date(`${a}T00:00:00Z`)) / 864e5)

export const SEAS = [0.98, 0.9, 0.95, 0.97, 1.0, 0.96, 0.94, 0.97, 1.0, 1.04, 1.08, 1.2]

const CFG = {
  h: {
    ped: [70, 65, 75, 95, 140, 180, 195],
    ticket: 74,
    canal: { salao: 0.6, ifood: 0.24, balcao: 0.09, app: 0.07 },
    tempo: 16.5,
    tempoFds: 2,
    cmv: 29.4,
    desp: 0.018,
    nota: 4.78,
    cancel: 0.5,
    acordo: 1.8,
    growth: 0.0002,
  },
  r: {
    ped: [35, 30, 38, 50, 110, 160, 175],
    ticket: 52,
    canal: { salao: 0, ifood: 0.57, balcao: 0.17, app: 0.26 },
    tempo: 19.5,
    tempoFds: 3.5,
    cmv: 30.2,
    desp: 0.024,
    nota: 4.74,
    cancel: 0.75,
    acordo: 2.2,
    growth: 0.0004,
  },
}

function dividirEtapas(tempo, rnd) {
  const forno = 7.2 + (rnd() - 0.5) * 0.6
  const resto = tempo - forno
  const montagem = resto * (0.55 + (rnd() - 0.5) * 0.06)
  const porta = resto * (0.15 + (rnd() - 0.5) * 0.03)
  return { montagem, forno, porta, despacho: resto - montagem - porta }
}

// Dias em que o monitor do KDS ficou com defeito e os pedidos não apareciam na montagem
// (o tempo disparou até o técnico trocar o cabo; na operação real chegou a 56 min). Serve para demonstrar o alerta de tempo fora do padrão.
const FALHA_KDS = { '2026-10-21': 42, '2026-10-22': 45 }

function gerar() {
  const rnd = mulberry32(20261111)
  const rndKds = mulberry32(5150)
  const rows = []
  const n = diffDays(START, END) + 1
  for (let i = 0; i < n; i++) {
    const date = addDays(START, i)
    const dow = dowOf(date)
    const mes = Number(date.slice(5, 7)) - 1
    const fimDe = n - 1 - i // 0 = último dia
    for (const loja of ['h', 'r']) {
      const c = CFG[loja]
      const pedidos = Math.round(c.ped[dow] * SEAS[mes] * (1 + c.growth * i) * (1 + (rnd() - 0.5) * 0.14))
      const ticket = c.ticket * (1 + (rnd() - 0.5) * 0.06) * (1 + 0.0001 * i)
      const bruto = pedidos * ticket

      const raw = {}
      for (const k of Object.keys(c.canal)) raw[k] = c.canal[k] > 0 ? Math.max(0.01, c.canal[k] + (rnd() - 0.5) * 0.04) : 0
      const soma = Object.values(raw).reduce((a, b) => a + b, 0)
      const canal = {}
      for (const k of Object.keys(raw)) canal[k] = (bruto * raw[k]) / soma

      const descontos = bruto * (0.04 + rnd() * 0.03)
      const taxas = canal.ifood * 0.23 + (bruto - canal.ifood) * 0.025
      const liquido = bruto - descontos - taxas

      const derivaSexta = loja === 'r' && fimDe < 42 && dow === 4 ? 2 : 0
      const tempo = c.tempo + (dow >= 4 ? c.tempoFds : 0) + (rnd() - 0.5) * 4 + derivaSexta
      const dentro = clamp(100 - (tempo - 11) * 7.5 + (rnd() - 0.5) * 4, 5, 95)

      const recente = loja === 'r' && fimDe < 35 ? (35 - fimDe) / 35 : 0
      const desperdicio = bruto * (c.desp + recente * 0.005 + (rnd() - 0.5) * 0.004)
      const cmv = c.cmv + recente * 1.4 + (rnd() - 0.5) * 1.4

      const rec28 = loja === 'r' && fimDe < 28
      const nota = Math.min(5, c.nota + (rnd() - 0.5) * 0.1)
      const cancel = Math.max(0.1, c.cancel + (rnd() - 0.5) * 0.5 + (rec28 ? 0.05 : 0))
      const acordo = Math.max(0.5, c.acordo + (rnd() - 0.5) * 0.6 + (rec28 ? 0.25 : 0))

      let motoboys = 0
      if (loja === 'r') motoboys = dow >= 4 ? 10 + Math.round((rnd() - 0.4) * 4) : 6 + Math.round((rnd() - 0.5) * 3)

      // Etapas do KDS: só os Holandeses têm o sistema. O forno é quase fixo (~7 min); a montagem e o
      // despacho é que absorvem o pico. Usa gerador próprio para não mexer nos demais números.
      const etapas = loja === 'h' ? dividirEtapas(tempo, rndKds) : { montagem: null, forno: null, porta: null, despacho: null }
      // Pedidos com motoboy do iFood (os únicos com tempo até o cliente): só entram quando a cooperativa falha.
      const motoIfood = Math.round(pedidos * (loja === 'r' ? 0.05 + rndKds() * 0.04 : 0.02 + rndKds() * 0.02))

      rows.push({
        date,
        loja,
        dow,
        mes,
        pedidos,
        ticket,
        bruto,
        descontos,
        taxas,
        liquido,
        canal,
        tempo,
        ...etapas,
        motoIfood,
        dentro,
        desperdicio,
        cmv,
        cmvValor: (bruto * cmv) / 100,
        nota,
        cancel,
        acordo,
        motoboys,
      })
    }
  }
  // Situação "real" de demonstração: a última sexta teve só 9 motoboys.
  const sexta = rows.find((r) => r.date === '2026-11-06' && r.loja === 'r')
  if (sexta) {
    sexta.motoboys = 9
    sexta.tempo = 29
    sexta.dentro = 12
  }
  for (const r of rows) {
    if (r.loja !== 'h' || !FALHA_KDS[r.date]) continue
    r.tempo = FALHA_KDS[r.date]
    r.dentro = 4
    r.montagem = r.tempo - r.forno - r.porta - r.despacho // a montagem concentra a espera
  }
  return rows
}

export const DAILY = gerar()

// Mapa de calor: tempo até o despacho por dia da semana x horário (fictício, média de 90 dias)
export const HORAS = ['18h', '19h', '20h', '21h', '22h', '23h']
export function mapaTempo(loja) {
  const rnd = mulberry32(loja === 'r' ? 91 : 92)
  const base = loja === 'r' ? 19.5 : 16.5
  const dowF = loja === 'r' ? [1, 1, 1, 1.05, 1.25, 1.22, 1.15] : [1, 1, 1, 1.03, 1.1, 1.12, 1.08]
  const horaF = [0.9, 1, 1.08, 1.18, 1.05, 0.92]
  const m = DIAS.map((_, d) => HORAS.map((_, h) => Math.round(base * dowF[d] * horaF[h] + (rnd() - 0.5) * 1.2)))
  if (loja === 'r') m[4][3] = 33
  return m
}
