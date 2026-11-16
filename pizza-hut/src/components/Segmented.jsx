import { motion } from 'framer-motion'

// Controle segmentado com "pílula" deslizante. `grupo` evita conflito de layoutId entre instâncias.
export default function Segmented({ valor, opcoes, onChange, grupo, rotulo, escuro = true }) {
  return (
    <div className={`seg ${escuro ? 'seg-escuro' : ''}`} role="radiogroup" aria-label={rotulo}>
      {opcoes.map((o) => {
        const ativo = o.id === valor
        return (
          <button key={o.id} role="radio" aria-checked={ativo} className={ativo ? 'on' : ''} onClick={() => onChange(o.id)}>
            {ativo && <motion.span layoutId={`seg-${grupo}`} className="seg-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
            <span className="seg-txt">{o.label}</span>
          </button>
        )
      })}
    </div>
  )
}
