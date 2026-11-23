import { selecionar, somar, variacao, PERIODOS } from '../data/metrics'
import { CMV_MAX, CMV_MIN, DAILY, DIAS, HORAS, META_ENTREGA, MIN_MOTOBOYS, END, addDays, mapaTempo } from '../data/daily'
import { SELO, avaliarSelo, sinais } from '../data/alertas'
import { conferencia } from '../data/estoque'
import { previsaoPedidos } from '../data/previsao'
import { DESP_CAUSAS, DESP_TIPOS, SABORES } from '../data/custos'
import { ETAPAS, maiorGargalo, mediaEtapas, ocorrencias } from '../data/kds'
import { semAcento, brlCent, brlCompacto, pct, dec1, dec2, int, min as fmtMin, sinal } from '../data/format'

// Cérebro simulado do Chef Hut. Tudo é calculado a partir dos mesmos dados do painel, então os
// números citados batem com as telas. Para ligar uma IA real, basta trocar esta função por uma
// chamada à API, mantendo a assinatura: answer(pergunta, contexto) => Promise<{ texto, acao }>.

const DIA_PALAVRAS = [
  ['segunda', 0],
  ['terca', 1],
  ['quarta', 2],
  ['quinta', 3],
  ['sexta', 4],
  ['sabado', 5],
  ['domingo', 6],
]
const NOME_DIA = ['segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado', 'domingo']
const PIZZAS_PEDIDO = 1.45
const MARGEM = 1.05

const R = { h: 'Holandeses', r: 'Renascença' }

function respostaMassas(q) {
  const prev = previsaoPedidos(14)
  const achado = DIA_PALAVRAS.find(([p]) => q.includes(p))
  const amanha = q.includes('amanha')
  const alvo = amanha ? prev[0] : achado ? prev.find((p) => p.dow === achado[1]) : null
  if (alvo) {
    const dia = NOME_DIA[alvo.dow]
    const total = alvo.massasH + alvo.massasR
    const ultimo = [...DAILY].reverse().find((r) => r.dow === alvo.dow)
    const mesmoDia = DAILY.filter((r) => r.date === ultimo.date)
    const antes = mesmoDia.reduce((a, r) => a + Math.ceil(r.pedidos * PIZZAS_PEDIDO * MARGEM), 0)
    return {
      texto: `Para ${amanha ? 'amanhã' : dia}, a previsão é de cerca de ${int(total)} massas: ${int(alvo.massasH)} em Holandeses e ${int(alvo.massasR)} na Renascença. Isso é ${sinal(variacao(total, antes))} em relação ao mesmo dia da semana na última vez. Conta feita com ${PIZZAS_PEDIDO.toString().replace('.', ',')} pizzas por pedido e 5% de margem.`,
      acao: { tab: 'estoque', label: 'Ver previsões' },
    }
  }
  const sete = prev.slice(0, 7)
  const total = sete.reduce((a, p) => a + p.massasH + p.massasR, 0)
  const pico = [...sete].sort((a, b) => b.massasH + b.massasR - (a.massasH + a.massasR))[0]
  return {
    texto: `Nos próximos 7 dias vão ser necessárias cerca de ${int(total)} massas nas duas lojas. O pico é ${NOME_DIA[pico.dow]}, com ${int(pico.massasH + pico.massasR)}. Se quiser um dia específico, pergunte, por exemplo, "quantas massas para sexta?".`,
    acao: { tab: 'estoque', label: 'Ver previsões' },
  }
}

// ['a', 'b', 'c'] => "a, b e c"
const lista = (itens) => (itens.length < 2 ? itens.join('') : `${itens.slice(0, -1).join(', ')} e ${itens[itens.length - 1]}`)

function respostaSelo(per) {
  const linhas = ['h', 'r'].map((l) => {
    const s = somar(selecionar(l, per))
    return { l, s, av: avaliarSelo(s) }
  })
  const ruins = []
  const quase = []
  for (const { l, s, av } of linhas)
    for (const k of Object.keys(av)) {
      const item = `${SELO[k].rotulo} da ${R[l]} (${SELO[k].fmt(s[k])})`
      if (av[k] === 'bad') ruins.push(item)
      if (av[k] === 'warn') quase.push(item)
    }
  let abertura
  if (ruins.length) abertura = `Atenção: o selo SUPER está em risco: ${lista(ruins)}.`
  else if (quase.length) abertura = `Nenhum indicador está fora dos limites, mas ${lista(quase)} ${quase.length > 1 ? 'estão' : 'está'} perto do limite.`
  else abertura = 'Os três indicadores estão dentro dos limites do selo SUPER nas duas lojas.'
  const detalhe = linhas.map(({ l, s }) => `${R[l]}: nota ${dec2(s.nota)}, cancelamento ${pct(s.cancel, 2)}, acordo ${pct(s.acordo, 2)}`).join('. ')
  return {
    texto: `${abertura} Limites: nota de 4,7 ou mais, cancelamento abaixo de 1% e taxa de acordo abaixo de 2,5%. ${detalhe}. O painel oficial do iFood continua sendo a referência final, e os dados têm até 48 h de defasagem.`,
    acao: { tab: 'entrega', label: 'Ver o selo SUPER' },
  }
}

function respostaCmv(per, label) {
  const lojas = ['h', 'r'].map((l) => ({ l, s: somar(selecionar(l, per)), a: somar(selecionar(l, per, 1)) }))
  const linhas = lojas.map(({ l, s, a }) => `${R[l]} em ${pct(s.cmv)} (${sinal(variacao(s.cmv, a.cmv))} sobre o período anterior)`)
  const r = lojas[1]
  const causa = DESP_CAUSAS[0]
  const massaQueijo = Math.round((DESP_TIPOS[0].share + DESP_TIPOS[1].share) * 100)
  let lead = `O CMV nos últimos ${label}: ${linhas.join(' e ')}. A faixa aceita é ${CMV_MIN}% a ${CMV_MAX}%.`
  const sobe = r.s.cmv > r.a.cmv
  const pistas = sobe
    ? ` Na Renascença o desperdício chegou a ${pct(r.s.despPct, 2)} do faturamento. Massa e queijo são ${massaQueijo}% do que é descartado, e a principal causa é ${causa.nome.toLowerCase()} (${Math.round(causa.share * 100)}%). Isso aponta onde olhar, mas confirme na conferência de estoque antes de concluir.`
    : ' Não há alta relevante neste período.'
  return { texto: lead + pistas, acao: { tab: 'desperdicio', label: 'Ver CMV e desperdício' } }
}

function respostaEntrega(per, label) {
  const h = somar(selecionar('h', per))
  const r = somar(selecionar('r', per))
  const m = mapaTempo('r')
  let max = { v: 0, d: 0, h: 0 }
  m.forEach((linha, d) => linha.forEach((v, hh) => v > max.v && (max = { v, d, h: hh })))
  const pico = DAILY.filter((x) => x.loja === 'r' && x.date >= addDays(END, -27) && x.dow >= 4)
  const abaixo = pico.filter((x) => x.motoboys < MIN_MOTOBOYS).length
  const folga = (v) => (v > META_ENTREGA ? `${dec1(v - META_ENTREGA)} min acima da meta` : 'dentro da meta')
  const motoboys = abaixo ? ` Nas últimas 4 semanas, ${abaixo} dias de pico tiveram menos de ${MIN_MOTOBOYS} motoboys, o que costuma explicar parte dos atrasos.` : ''
  return {
    texto: `Do pedido cair na central até o motoboy sair, o tempo nos últimos ${label} é ${fmtMin(h.tempo)} em Holandeses (${folga(h.tempo)}) e ${fmtMin(r.tempo)} na Renascença (${folga(r.tempo)}), para uma meta de ${META_ENTREGA} min. Só ${pct(r.dentro, 0)} dos pedidos da Renascença saem nesse prazo. O pior horário lá é ${NOME_DIA[max.d]} às ${HORAS[max.h]}, com ${max.v} min em média.${motoboys} O tempo até o cliente só existe para o motoboy do iFood (${pct(r.coberturaCliente, 0)} dos pedidos); a cooperativa não informa.`,
    acao: { tab: 'entrega', label: 'Ver entregas', loja: 'r' },
  }
}

function respostaProducao(per, label) {
  const med = mediaEtapas(selecionar('h', per))
  const g = maiorGargalo(med)
  const linhas = ETAPAS.map((e) => `${e.nome.toLowerCase()} ${dec1(med[e.id])} min (meta ${dec1(e.meta)})`).join(', ')
  const ev = ocorrencias('h', 28)[0]
  const extra = ev ? ` Atenção: houve ${ev.dias} dias fora do padrão, com pico de ${Math.round(ev.pico)} min. Antes de cobrar a equipe, vale checar o equipamento do KDS.` : ''
  return {
    texto: `Nos últimos ${label}, o pedido leva ${dec1(med.total)} min até o despacho nos Holandeses, para meta de ${META_ENTREGA} min. Por etapa: ${linhas}. A etapa que mais passa da meta é ${g.nome.toLowerCase()} (${dec1(g.excesso)} min). O forno é praticamente fixo, então o ganho está no resto.${extra} A análise é por etapa, não por pessoa, e a Renascença ainda não tem KDS.`,
    acao: { tab: 'producao', label: 'Ver produção' },
  }
}

function respostaHoje(loja) {
  const lista = sinais(loja).filter((s) => s.nivel !== 'ok').slice(0, 3)
  if (!lista.length) return { texto: 'Nada pede atenção agora. Todos os indicadores estão dentro dos limites.', acao: null }
  const itens = lista.map((s, i) => `${i + 1}) ${s.titulo}`).join('  ')
  return { texto: `Hoje eu olharia para isto, em ordem de urgência: ${itens}.`, acao: { tab: lista[0].tab, label: 'Abrir o primeiro' } }
}

function respostaEstoque() {
  const itens = conferencia('all').filter((i) => i.status !== 'ok').sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff))
  if (!itens.length) return { texto: 'As contagens estão todas dentro da tolerância de 2,5%.', acao: { tab: 'estoque', label: 'Ver estoque' } }
  const top = itens.slice(0, 3).map((i) => `${i.nome} (${R[i.loja]}) ${sinal(i.diff).replace('%', '')}%`).join(', ')
  const rec = itens.find((i) => i.recorrente && i.status === 'bad')
  const extra = rec ? ` O caso que mais merece investigação é ${rec.nome.toLowerCase()} na ${R[rec.loja]}: ${rec.hist.map((h) => `${dec1(Math.abs(h))}%`).join(', ')} em três contagens seguidas.` : ''
  return {
    texto: `Maiores divergências: ${top}.${extra} Divergência não prova furto: pode ser erro de contagem, de receita ou perda no preparo. O que sinaliza problema é a diferença que cresce contagem após contagem.`,
    acao: { tab: 'estoque', label: 'Ver conferência' },
  }
}

function respostaDesperdicio(per, label) {
  const s = somar(selecionar('all', per))
  const tipo = DESP_TIPOS[0]
  const causa = DESP_CAUSAS[0]
  return {
    texto: `Nos últimos ${label}, o desperdício foi de ${brlCompacto(s.desperdicio)}, ${pct(s.despPct, 2)} do faturamento. O maior item é ${tipo.nome.toLowerCase()} (${Math.round(tipo.share * 100)}%) e a principal causa é ${causa.nome.toLowerCase()} (${Math.round(causa.share * 100)}%). Prever melhor as massas é a forma mais direta de reduzir essa perda.`,
    acao: { tab: 'desperdicio', label: 'Ver desperdício' },
  }
}

function respostaVendas(per, label) {
  const h = somar(selecionar('h', per))
  const r = somar(selecionar('r', per))
  const [lider, outra] = h.bruto >= r.bruto ? [['h', h], ['r', r]] : [['r', r], ['h', h]]
  const dif = variacao(lider[1].bruto, outra[1].bruto)
  const ah = somar(selecionar('h', per, 1))
  const ar = somar(selecionar('r', per, 1))
  return {
    texto: `Nos últimos ${label}, ${R[lider[0]]} lidera com ${brlCompacto(lider[1].bruto)}, ${pct(dif, 0)} a mais que ${R[outra[0]]} (${brlCompacto(outra[1].bruto)}). O ticket médio é ${brlCent(h.ticket)} em Holandeses e ${brlCent(r.ticket)} na Renascença. Em crescimento sobre o período anterior: Holandeses ${sinal(variacao(h.bruto, ah.bruto))} e Renascença ${sinal(variacao(r.bruto, ar.bruto))}.`,
    acao: { tab: 'geral', label: 'Ver comparativo' },
  }
}

function respostaSabores() {
  const top = [...SABORES].sort((a, b) => b.h + b.r - (a.h + a.r)).slice(0, 3)
  return {
    texto: `Os sabores que mais saem nas duas lojas são ${top.map((s) => s.nome).join(', ')}. A Renascença vende mais doce e frango com catupiry, enquanto Holandeses vende mais pepperoni e portuguesa. O mix por sabor é uma amostra de demonstração.`,
    acao: { tab: 'vendas', label: 'Ver vendas e mix' },
  }
}

function respostaEquipe() {
  return {
    texto: 'O painel analisa o desempenho por etapa da produção (montagem, forno, corte e despacho) e por dia, não por pessoa. Assim dá para ver onde o pedido espera sem expor um funcionário só por causa de um número isolado.',
    acao: { tab: 'producao', label: 'Ver produção' },
  }
}

const INTENCOES = [
  { teste: /\b(oi|ola|bom dia|boa tarde|boa noite|e ai|opa)\b/, resp: () => ({ texto: 'Oi! Pode perguntar sobre vendas, entrega, produção, CMV, desperdício, massas, estoque ou selo SUPER.', acao: null }) },
  { teste: /ajuda|o que (voce|vc) (faz|sabe)|como funciona|quem e voce/, resp: () => ({ texto: 'Sou o Chef Hut, assistente do painel. Respondo com os números das duas lojas: vendas, entrega, CMV, desperdício, massas, estoque, selo SUPER e produção. Minhas respostas são simuladas neste protótipo.', acao: null }) },
  { teste: /massa|amanha|previs|quantas|proxim/, resp: (q) => respostaMassas(q) },
  { teste: /estoque|diverg|furto|roubo|falta|contagem|sumi/, resp: () => respostaEstoque() },
  { teste: /super|selo|ifood|nota|cancel|acordo/, resp: (_, c) => respostaSelo(c.periodo) },
  { teste: /cmv|custo/, resp: (_, c) => respostaCmv(c.periodo, c.label) },
  { teste: /desperd|perda|jogad|descart/, resp: (_, c) => respostaDesperdicio(c.periodo, c.label) },
  { teste: /producao|etapa|forno|montagem|kds|gargalo|cozinha|despacho|make/, resp: (_, c) => respostaProducao(c.periodo, c.label) },
  { teste: /entrega|atras|tempo|motoboy|entregador|demor/, resp: (_, c) => respostaEntrega(c.periodo, c.label) },
  { teste: /hoje|resolver|prioridad|atencao|alerta|sinal|problema|urgente/, resp: (_, c) => respostaHoje(c.loja) },
  { teste: /equipe|funcionari|bonific|desempenho|pessoal/, resp: () => respostaEquipe() },
  { teste: /sabor|pizza|mix|calabresa|cardapio/, resp: () => respostaSabores() },
  { teste: /loja|vende|venda|fatura|ticket|pedido|receita|dinheiro/, resp: (_, c) => respostaVendas(c.periodo, c.label) },
]

const FALLBACK = {
  texto: 'Ainda não sei responder isso. Posso falar de vendas, entrega, produção, CMV, desperdício, massas, estoque e selo SUPER. Tente, por exemplo, "como está o CMV?".',
  acao: null,
}

export async function answer(pergunta, contexto = {}) {
  const periodo = contexto.periodo || '30d'
  const ctx = { loja: contexto.loja || 'all', periodo, label: PERIODOS[periodo].label }
  const q = semAcento(pergunta).replace(/[?!.,;:]/g, ' ')
  const achada = INTENCOES.find((i) => i.teste.test(q))
  return achada ? achada.resp(q, ctx) : FALLBACK
}
