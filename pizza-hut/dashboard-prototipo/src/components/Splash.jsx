import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import logo from '../assets/logo-pizzahut.png'

// Padrão de quadrados em tons de vinho, como na capa dos slides.
const TONS = ['#a02020', '#701818', '#b42626', 'transparent', '#8a1c1c', 'transparent']
const COLS = 4
const LINHAS = 6

export default function Splash() {
  const pular = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('skip')
  const [visivel, setVisivel] = useState(!pular)

  useEffect(() => {
    if (!visivel) return undefined
    const t = setTimeout(() => setVisivel(false), 3600)
    const tecla = () => setVisivel(false)
    window.addEventListener('keydown', tecla)
    return () => {
      clearTimeout(t)
      window.removeEventListener('keydown', tecla)
    }
  }, [visivel])

  return (
    <AnimatePresence>
      {visivel && (
        <motion.div
          className="splash"
          onClick={() => setVisivel(false)}
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          role="dialog"
          aria-label="Abertura"
        >
          <div className="splash-grade" aria-hidden="true">
            {Array.from({ length: COLS * LINHAS }, (_, i) => {
              const x = i % COLS
              const y = Math.floor(i / COLS)
              const tom = TONS[(x * 3 + y * 5) % TONS.length]
              return (
                <motion.span
                  key={i}
                  style={{ background: tom }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15 + (x + y) * 0.07, duration: 0.5, ease: [0.2, 0.9, 0.3, 1.2] }}
                />
              )
            })}
          </div>

          <div className="splash-centro">
            <motion.div className="splash-logo" initial={{ scale: 0.5, opacity: 0, rotate: -6 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} transition={{ delay: 0.3, type: 'spring', stiffness: 180, damping: 14 }}>
              <img src={logo} alt="Pizza Hut" />
            </motion.div>
            <motion.p className="splash-kicker" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
              OXYGENI HUB · DESAFIO TECHX
            </motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.6 }}>
              Plataforma de BI para duas unidades Pizza Hut
            </motion.h2>
            <motion.p className="splash-sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
              Holandeses × Renascença · protótipo com dados fictícios
            </motion.p>
            <motion.div className="splash-barra" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
              <motion.span initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ delay: 1.7, duration: 1.8, ease: 'linear' }} />
            </motion.div>
            <p className="splash-dica">Clique ou aperte qualquer tecla para entrar</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
