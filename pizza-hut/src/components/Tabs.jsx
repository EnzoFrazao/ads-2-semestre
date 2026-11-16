import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Bike, Boxes, DatabaseZap, LayoutDashboard, Pizza, Trash2, Users, Wallet } from 'lucide-react'
import { TABS, useDash } from '../state/DashContext'

const ICONES = { LayoutDashboard, Bike, Wallet, Trash2, Pizza, Boxes, Users, DatabaseZap }

export default function Tabs() {
  const { tab, setTab } = useDash()
  const ativa = useRef(null)

  useEffect(() => {
    ativa.current?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  }, [tab])

  return (
    <nav className="tabs" aria-label="Seções do painel">
      <div className="tabs-lista" role="tablist">
        {TABS.map((t) => {
          const Icone = ICONES[t.icone]
          const on = t.id === tab
          return (
            <button key={t.id} ref={on ? ativa : null} role="tab" aria-selected={on} className={on ? 'on' : ''} onClick={() => setTab(t.id)}>
              <Icone size={16} aria-hidden="true" />
              <span>{t.label}</span>
              {on && <motion.span layoutId="tab-ativa" className="tab-linha" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
