import { CMV_MAX, CMV_MIN, DAILY, END, META_ENTREGA, MIN_MOTOBOYS, addDays, DIAS, HORAS, mapaTempo } from './daily'
import { selecionar, somar, variacao } from './metrics'
import { conferencia } from './estoque'
import { LOJAS } from './daily'
import { dec1, dec2, pct } from './format'

// Limites do selo SUPER do iFood. `aviso` é a folga relativa abaixo da qual o indicador já fica amarelo.
export const SELO = {
  nota: { rotulo: 'nota', limite: 4.7, tipo: 'min', aviso: 0.01, fmt: dec2 },
  cancel: { rotulo: 'cancelamento', limite: 1, tipo: 'max', aviso: 0.2, fmt: (v) => pct(v, 2) },
  acordo: { rotulo: 'taxa de acordo', limite: 2.5, tipo: 'max', aviso: 0.12, fmt: (v) => pct(v, 2) },
}

export function nivelSuper(valor, limite, tipo, aviso) {
  const ok = tipo === 'min' ? valor >= limite : valor < limite
  if (!ok) return 'bad'
  const folga = tipo === 'min' ? (valor - limite) / limite : (limite - valor) / limite
  return folga < aviso ? 'warn' : 'ok'
}

// { nota, cancel, acordo } => 'ok' | 'warn' | 'bad'
export function avaliarSelo(s) {
  return Object.fromEntries(Object.entries(SELO).map(([k, c]) => [k, nivelSuper(s[k], c.limite, c.tipo, c.aviso)]))
}

// Sinais amarelo e vermelho calculados a partir dos dados. O Chef Hut usa a mesma função.
export function sinais(loja = 'all') {
  const lista = []
  const lojas = loja === 'all' ? ['h', 'r'] : [loja]

  if (lojas.includes('r')) {
    const m = mapaTempo('r')
    let max = { v: 0, d: 0, h: 0 }
    m.forEach((linha, d) => linha.forEach((v, h) => v > max.v && (max = { v, d, h })))
    if (max.v > META_ENTREGA) {
      lista.push({
        id: 'entrega-pico',
        nivel: max.v > META_ENTREGA + 8 ? 'bad' : 'warn',
        titulo: `Renascença: ${DIAS[max.d].toLowerCase()} às ${HORAS[max.h]} em ${max.v} min`,
        detalhe: `Pico acima da meta de ${META_ENTREGA} min nas entregas.`,
        tab: 'entrega',
      })
    }

    const ini = addDays(END, -27)
    const pico = DAILY.filter((r) => r.loja === 'r' && r.date >= ini && r.dow >= 4)
    const abaixo = pico.filter((r) => r.motoboys < MIN_MOTOBOYS)
    if (abaixo.length) {
      lista.push({
        id: 'motoboys',
        nivel: abaixo.length >= 3 ? 'bad' : 'warn',
        titulo: `Renascença: menos de ${MIN_MOTOBOYS} motoboys em ${abaixo.length} dias de pico`,
        detalhe: 'Contagem de sexta a domingo nas últimas 4 semanas.',
        tab: 'entrega',
      })
    }
  }

  for (const l of lojas) {
    const s = somar(selecionar(l, '30d'))
    const nome = LOJAS[l].nome
    if (s.cmv > CMV_MAX)
      lista.push({ id: `cmv-${l}`, nivel: 'bad', titulo: `${nome}: CMV em ${pct(s.cmv)}`, detalhe: `Acima do teto de ${CMV_MAX}%. Pode ser desperdício ou perda.`, tab: 'desperdicio' })
    else if (s.cmv >= CMV_MAX - 1.2)
      lista.push({ id: `cmv-${l}`, nivel: 'warn', titulo: `${nome}: CMV em ${pct(s.cmv)}`, detalhe: `Perto do teto de ${CMV_MAX}% nas últimas 4 semanas.`, tab: 'desperdicio' })
    else if (s.cmv < CMV_MIN)
      lista.push({ id: `cmv-${l}`, nivel: 'warn', titulo: `${nome}: CMV em ${pct(s.cmv)}`, detalhe: `Abaixo da faixa de ${CMV_MIN}%. Vale conferir os lançamentos.`, tab: 'desperdicio' })

    const atual = somar(selecionar(l, '7d'))
    const antes = somar(selecionar(l, '7d', 1))
    const v = variacao(atual.desperdicio, antes.desperdicio)
    if (v > 15)
      lista.push({ id: `desp-${l}`, nivel: 'warn', titulo: `${nome}: desperdício ${pct(v, 0)} acima da semana anterior`, detalhe: `${pct(atual.despPct, 2)} do faturamento nos últimos 7 dias.`, tab: 'desperdicio' })
  }

  for (const l of lojas) {
    const s = somar(selecionar(l, '30d'))
    const av = avaliarSelo(s)
    const nome = LOJAS[l].nome
    const ruins = Object.keys(av).filter((k) => av[k] === 'bad')
    const quase = Object.keys(av).filter((k) => av[k] === 'warn')
    const detalhe = (ks) => ks.map((k) => `${SELO[k].rotulo} ${SELO[k].fmt(s[k])} (limite ${SELO[k].fmt(SELO[k].limite)})`).join('; ')
    if (ruins.length)
      lista.push({ id: `super-${l}`, nivel: 'bad', titulo: `${nome}: selo SUPER em risco`, detalhe: detalhe(ruins), tab: 'entrega' })
    else if (quase.length)
      lista.push({ id: `super-${l}`, nivel: 'warn', titulo: `${nome}: ${quase.map((k) => SELO[k].rotulo).join(' e ')} perto do limite do SUPER`, detalhe: detalhe(quase), tab: 'entrega' })
  }

  conferencia(loja)
    .filter((i) => i.status === 'bad')
    .forEach((i) =>
      lista.push({
        id: `estoque-${i.loja}-${i.nome}`,
        nivel: 'bad',
        titulo: `${LOJAS[i.loja].nome}: ${i.nome} com divergência de ${dec1(Math.abs(i.diff))}%`,
        detalhe: i.recorrente ? 'Divergência crescente em 3 contagens seguidas. Vale investigar.' : 'Contagem física abaixo do estoque teórico.',
        tab: 'estoque',
      }),
    )

  lista.push({
    id: 'defasagem',
    nivel: 'warn',
    titulo: 'Dados do iFood com até 48 h de defasagem',
    detalhe: 'Vêm do Toqan. Os números de ontem podem mudar.',
    tab: 'dados',
  })

  const ordem = { bad: 0, warn: 1, ok: 2 }
  return lista.sort((a, b) => ordem[a.nivel] - ordem[b.nivel])
}
