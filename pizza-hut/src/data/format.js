const nf0 = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 })
const nf1 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
const nf2 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const brl0 = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
const brl2 = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export const int = (v) => nf0.format(Math.round(v))
export const dec1 = (v) => nf1.format(v)
export const dec2 = (v) => nf2.format(v)
export const brl = (v) => brl0.format(Math.round(v))
export const brlCent = (v) => brl2.format(v)
export const pct = (v, casas = 1) => `${(casas === 0 ? nf0 : casas === 2 ? nf2 : nf1).format(v)}%`
export const min = (v) => `${nf0.format(Math.round(v))} min`

// R$ 1,24 mi / R$ 754 mil / R$ 640
export function brlCompacto(v) {
  const a = Math.abs(v)
  if (a >= 1_000_000) return `R$ ${nf2.format(v / 1_000_000)} mi`
  if (a >= 10_000) return `R$ ${nf0.format(v / 1000)} mil`
  if (a >= 1000) return `R$ ${nf1.format(v / 1000)} mil`
  return `R$ ${nf0.format(v)}`
}

export const dataCurta = (iso) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`
export const dataLonga = (iso) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}`

export const sinal = (v) => {
  const r = Math.round(Math.abs(v) * 10) / 10
  return `${r === 0 ? '' : v > 0 ? '+' : '−'}${nf1.format(r)}%`
}

export function semAcento(t) {
  return t
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}
