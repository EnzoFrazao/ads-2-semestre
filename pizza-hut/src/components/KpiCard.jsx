import { useEffect, useRef, useState } from 'react'
import { animate, motion, useReducedMotion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import { sinal } from '../data/format'

export function CountUp({ value, format = (v) => Math.round(v).toString(), duration = 1.2 }) {
  const reduzir = useReducedMotion()
  const [v, setV] = useState(reduzir ? value : 0)
  const anterior = useRef(reduzir ? value : 0)
  useEffect(() => {
    if (reduzir) {
      setV(value)
      return undefined
    }
    const ctl = animate(anterior.current, value, {
      duration,
      ease: [0.2, 0.7, 0.2, 1],
      onUpdate: (x) => {
        anterior.current = x
        setV(x)
      },
    })
    return () => ctl.stop()
  }, [value, duration, reduzir])
  return <>{format(v)}</>
}

function Sparkline({ dados, cor }) {
  const v = dados.filter((x) => x != null)
  if (v.length < 2) return null
  const min = Math.min(...v)
  const max = Math.max(...v)
  const w = 100
  const h = 28
  const pts = v.map((y, i) => [(i / (v.length - 1)) * w, h - 3 - ((y - min) / (max - min || 1)) * (h - 6)])
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
  return (
    <svg className="spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
      <motion.path
        d={d}
        fill="none"
        stroke={cor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.3, ease: 'easeOut' }}
      />
    </svg>
  )
}

// delta: variação % em relação ao período anterior. inverso: quando cair é bom (CMV, tempo, desperdício).
export default function KpiCard({ icone: Icone, rotulo, valor, formato, delta, inverso = false, nota, status, spark, i = 0, cor = 'var(--primary)' }) {
  const bom = delta == null ? null : inverso ? delta <= 0 : delta >= 0
  const Seta = delta == null ? null : Math.abs(delta) < 0.05 ? Minus : delta > 0 ? ArrowUpRight : ArrowDownRight
  return (
    <motion.article
      className="kpi card"
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -3 }}
      transition={{ delay: 0.07 * i, duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
    >
      <div className="kpi-top">
        <span className="kpi-label">{rotulo}</span>
        {Icone && (
          <span className="kpi-icon" aria-hidden="true">
            <Icone size={18} />
          </span>
        )}
      </div>
      <div className="kpi-value">
        <CountUp value={valor} format={formato} />
      </div>
      <div className="kpi-foot">
        {delta != null && (
          <span className={`delta ${bom ? 'delta-bom' : 'delta-ruim'}`}>
            <Seta size={14} aria-hidden="true" />
            {sinal(delta)}
            <span className="sr-only">{bom ? ' (melhora)' : ' (piora)'}</span>
          </span>
        )}
        {status && <span className={`status status-${status.nivel}`}><span className="status-dot" aria-hidden="true" />{status.texto}</span>}
        {nota && <span className="kpi-nota">{nota}</span>}
      </div>
      {spark && <Sparkline dados={spark} cor={cor} />}
    </motion.article>
  )
}
