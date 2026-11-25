import { motion } from 'framer-motion'
import { NOME_LOJA } from './Chart'

// "Duelo" entre as lojas: barras horizontais lado a lado, uma linha por indicador.
// linhas: [{ rotulo, h, r, fmt, melhor: 'maior' | 'menor' | null }]
export default function Comparativo({ linhas }) {
  const placar = { h: 0, r: 0 }
  for (const l of linhas) {
    if (!l.melhor || l.h === l.r) continue
    placar[(l.melhor === 'maior' ? l.h > l.r : l.h < l.r) ? 'h' : 'r'] += 1
  }
  return (
    <div className="duelo">
      <div className="duelo-leg" aria-hidden="true">
        <span><i className="sq sq-h" />{NOME_LOJA.h}</span>
        <span><i className="sq sq-r" />{NOME_LOJA.r}</span>
      </div>
      <p className="duelo-placar">
        <strong>{placar.h}</strong> {NOME_LOJA.h} × {NOME_LOJA.r} <strong>{placar.r}</strong> <span>(indicadores em que cada loja está melhor)</span>
      </p>
      {linhas.map((l, idx) => {
        const max = Math.max(l.h, l.r) || 1
        const vence = l.melhor ? ((l.melhor === 'maior' ? l.h > l.r : l.h < l.r) ? 'h' : 'r') : null
        return (
          <div className="duelo-linha" key={l.rotulo}>
            <span className="duelo-rotulo">{l.rotulo}</span>
            {['h', 'r'].map((k) => (
              <div className="duelo-barra" key={k}>
                <div className="duelo-trilho">
                  <motion.span
                    className={`duelo-fill fill-${k}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(l[k] / max) * 100}%` }}
                    transition={{ delay: 0.25 + idx * 0.08, duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
                  />
                </div>
                <strong className={vence === k ? 'duelo-vence' : ''}>
                  {l.fmt(l[k])}
                  {vence === k && <span className="sr-only"> (melhor)</span>}
                </strong>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
