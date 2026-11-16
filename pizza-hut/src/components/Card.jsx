import { motion } from 'framer-motion'

export default function Card({ title, sub, right, children, className = '', i = 0, flush = false }) {
  return (
    <motion.section
      className={`card ${className}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 * i, duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {(title || right) && (
        <header className="card-head">
          <div>
            {title && <h3>{title}</h3>}
            {sub && <p className="card-sub">{sub}</p>}
          </div>
          {right && <div className="card-right">{right}</div>}
        </header>
      )}
      <div className={flush ? 'card-body flush' : 'card-body'}>{children}</div>
    </motion.section>
  )
}

export function Pill({ children, tom = 'red' }) {
  return <span className={`pill pill-${tom}`}>{children}</span>
}

export function Status({ nivel, children }) {
  const rot = { ok: 'Ok', warn: 'Atenção', bad: 'Crítico' }[nivel]
  return (
    <span className={`status status-${nivel}`}>
      <span className="status-dot" aria-hidden="true" />
      {children ?? rot}
    </span>
  )
}
