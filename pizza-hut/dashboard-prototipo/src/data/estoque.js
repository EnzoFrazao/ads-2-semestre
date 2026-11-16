// Conferência de estoque (fictícia). Diferença = contagem física em relação ao estoque teórico.
export const INSUMOS = [
  { loja: 'h', nome: 'Muçarela', un: 'kg', teorico: 420, diff: -1.8, hist: [-1.2, -1.5, -1.8] },
  { loja: 'h', nome: 'Calabresa', un: 'kg', teorico: 96, diff: -2.4, hist: [-2.1, -2.0, -2.4] },
  { loja: 'h', nome: 'Massa congelada', un: 'un', teorico: 1180, diff: -2.9, hist: [-2.2, -2.6, -2.9] },
  { loja: 'h', nome: 'Molho de tomate', un: 'kg', teorico: 210, diff: -1.2, hist: [-1.0, -1.3, -1.2] },
  { loja: 'h', nome: 'Borda catupiry', un: 'kg', teorico: 64, diff: -3.6, hist: [-2.4, -3.1, -3.6] },
  { loja: 'h', nome: 'Refrigerante lata', un: 'un', teorico: 2400, diff: -0.8, hist: [-0.6, -0.9, -0.8] },
  { loja: 'h', nome: 'Caixa 35 cm', un: 'un', teorico: 900, diff: -0.5, hist: [-0.4, -0.5, -0.5] },
  { loja: 'h', nome: 'Bacon', un: 'kg', teorico: 58, diff: -4.1, hist: [-3.2, -3.8, -4.1] },
  { loja: 'r', nome: 'Muçarela', un: 'kg', teorico: 310, diff: -2.1, hist: [-1.8, -2.0, -2.1] },
  { loja: 'r', nome: 'Calabresa', un: 'kg', teorico: 72, diff: -3.8, hist: [-2.9, -3.4, -3.8] },
  { loja: 'r', nome: 'Massa congelada', un: 'un', teorico: 980, diff: -6.4, hist: [-3.1, -4.8, -6.4] },
  { loja: 'r', nome: 'Molho de tomate', un: 'kg', teorico: 150, diff: -1.5, hist: [-1.4, -1.6, -1.5] },
  { loja: 'r', nome: 'Borda catupiry', un: 'kg', teorico: 52, diff: -2.2, hist: [-2.0, -2.3, -2.2] },
  { loja: 'r', nome: 'Refrigerante lata', un: 'un', teorico: 1800, diff: -1.1, hist: [-0.9, -1.0, -1.1] },
  { loja: 'r', nome: 'Caixa 35 cm', un: 'un', teorico: 1500, diff: -5.2, hist: [-3.0, -4.1, -5.2] },
  { loja: 'r', nome: 'Frango', un: 'kg', teorico: 44, diff: -3.0, hist: [-2.6, -2.8, -3.0] },
]

export function statusDiff(diff) {
  const a = Math.abs(diff)
  if (a > 5) return 'bad'
  if (a > 2.5) return 'warn'
  return 'ok'
}

export const ROTULO = { ok: 'Ok', warn: 'Atenção', bad: 'Investigar' }

export function conferencia(loja) {
  return INSUMOS.filter((i) => loja === 'all' || i.loja === loja).map((i) => ({
    ...i,
    contado: Math.round(i.teorico * (1 + i.diff / 100)),
    status: statusDiff(i.diff),
    // divergência que cresce e passa de 2,5% em todas as contagens recentes merece ação
    recorrente: i.hist.every((h) => Math.abs(h) > 2.5) && Math.abs(i.hist[2]) > Math.abs(i.hist[0]),
  }))
}
