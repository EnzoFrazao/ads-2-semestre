import { motion } from 'framer-motion'
import { AlertOctagon, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useDash } from '../state/DashContext'

const ICONE = { bad: AlertOctagon, warn: AlertTriangle, ok: CheckCircle2 }
const ROTULO = { bad: 'Crítico', warn: 'Atenção', ok: 'Ok' }

export default function AlertList({ itens, limite }) {
  const { irPara } = useDash()
  const lista = limite ? itens.slice(0, limite) : itens
  return (
    <ul className="alertas">
      {lista.map((a, idx) => {
        const Icone = ICONE[a.nivel]
        return (
          <motion.li
            key={a.id}
            className={`alerta alerta-${a.nivel}`}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + idx * 0.07, duration: 0.4 }}
          >
            <span className="alerta-icone" aria-hidden="true">
              <Icone size={18} />
            </span>
            <div className="alerta-texto">
              <strong>
                <span className="sr-only">{ROTULO[a.nivel]}: </span>
                {a.titulo}
              </strong>
              <span>{a.detalhe}</span>
            </div>
            {a.tab && (
              <button className="alerta-ir" onClick={() => irPara(a.tab)} aria-label={`Ver detalhes: ${a.titulo}`}>
                <ArrowRight size={16} />
              </button>
            )}
          </motion.li>
        )
      })}
    </ul>
  )
}
