import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Pause, Play, SkipForward, X } from 'lucide-react'
import { TABS, useDash } from '../state/DashContext'

const SEGUNDOS = 12
// Na demonstração, a aba de entrega mostra só a Renascença (delivery) e a de produção só os Holandeses (único com KDS);
// as demais mostram as duas lojas.
const LOJA_POR_TAB = { entrega: 'r', producao: 'h' }

export default function ModoApresentacao() {
  const { presenting, setPresenting, tab, setTab, setLoja } = useDash()
  const [pausado, setPausado] = useState(false)
  const idx = TABS.findIndex((t) => t.id === tab)

  const ir = (i) => {
    const prox = TABS[(i + TABS.length) % TABS.length]
    setTab(prox.id)
    setLoja(LOJA_POR_TAB[prox.id] || 'all')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    if (!presenting) return undefined
    setPausado(false)
    ir(0)
    const esc = (e) => e.key === 'Escape' && setPresenting(false)
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presenting])

  useEffect(() => {
    if (!presenting || pausado) return undefined
    const t = setTimeout(() => ir(idx + 1), SEGUNDOS * 1000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presenting, pausado, tab])

  return (
    <AnimatePresence>
      {presenting && (
        <motion.div className="presenting-bar" initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }} role="region" aria-label="Modo apresentação">
          <span className="pres-titulo">
            Apresentação · {idx + 1} de {TABS.length} · {TABS[idx]?.label}
          </span>
          <button onClick={() => setPausado((p) => !p)} aria-label={pausado ? 'Retomar' : 'Pausar'}>
            {pausado ? <Play size={16} /> : <Pause size={16} />}
          </button>
          <button onClick={() => ir(idx + 1)} aria-label="Próxima seção">
            <SkipForward size={16} />
          </button>
          <button onClick={() => setPresenting(false)} aria-label="Sair da apresentação (Esc)">
            <X size={16} />
          </button>
          <div className="pres-progresso">
            <motion.span key={`${tab}-${pausado}`} initial={{ width: pausado ? '0%' : '0%' }} animate={{ width: pausado ? '0%' : '100%' }} transition={{ duration: SEGUNDOS, ease: 'linear' }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
