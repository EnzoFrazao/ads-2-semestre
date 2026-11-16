import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Send, X } from 'lucide-react'
import { useDash } from '../state/DashContext'
import ChefAvatar from './ChefAvatar'
import { answer } from './brain'
import { BOAS_VINDAS, SUGESTOES } from './suggestions'

// Escreve o texto aos poucos, como se o Chef estivesse digitando.
function TextoAnimado({ texto, animar, onFim }) {
  const [n, setN] = useState(animar ? 0 : texto.length)
  useEffect(() => {
    if (!animar) return undefined
    const id = setInterval(() => {
      setN((v) => {
        if (v >= texto.length) {
          clearInterval(id)
          return v
        }
        return Math.min(texto.length, v + 3)
      })
    }, 18)
    return () => clearInterval(id)
  }, [texto, animar])
  useEffect(() => {
    if (n >= texto.length) onFim?.()
  }, [n, texto.length, onFim])
  return <>{texto.slice(0, n)}</>
}

export default function ChefHut() {
  const { loja, periodo, irPara } = useDash()
  const reduzir = useReducedMotion()
  const [aberto, setAberto] = useState(false)
  const [balao, setBalao] = useState(false)
  const [digitando, setDigitando] = useState(false)
  const [texto, setTexto] = useState('')
  const [msgs, setMsgs] = useState([{ id: 0, autor: 'chef', texto: BOAS_VINDAS, animar: false }])
  const fim = useRef(null)
  const campo = useRef(null)
  const idRef = useRef(1)

  useEffect(() => {
    const a = setTimeout(() => setBalao(true), 4200)
    const b = setTimeout(() => setBalao(false), 12000)
    return () => {
      clearTimeout(a)
      clearTimeout(b)
    }
  }, [])

  useEffect(() => {
    if (aberto) {
      setBalao(false)
      setTimeout(() => campo.current?.focus(), 250)
    }
  }, [aberto])

  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && setAberto(false)
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [])

  const rolar = useCallback(() => {
    fim.current?.scrollIntoView({ block: 'end' })
  }, [])
  useEffect(() => {
    rolar()
  }, [msgs, digitando, rolar])

  const perguntar = async (pergunta) => {
    const t = pergunta.trim()
    if (!t || digitando) return
    setMsgs((m) => [...m, { id: idRef.current++, autor: 'user', texto: t }])
    setTexto('')
    setDigitando(true)
    const [resp] = await Promise.all([answer(t, { loja, periodo }), new Promise((r) => setTimeout(r, reduzir ? 0 : 800))])
    setDigitando(false)
    setMsgs((m) => [...m, { id: idRef.current++, autor: 'chef', texto: resp.texto, acao: resp.acao, animar: !reduzir }])
  }

  return (
    <div className="chef">
      <AnimatePresence>
        {aberto && (
          <motion.div
            className="chef-painel"
            role="dialog"
            aria-label="Chef Hut, assistente do painel"
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
          >
            <header className="chef-cab">
              <span className="chef-cab-avatar">
                <ChefAvatar busto animar={false} />
              </span>
              <div>
                <strong>Chef Hut</strong>
                <span>Assistente do painel · respostas simuladas</span>
              </div>
              <button onClick={() => setAberto(false)} aria-label="Fechar o Chef Hut">
                <X size={18} />
              </button>
            </header>

            <div className="chef-msgs" aria-live="polite">
              {msgs.map((m) => (
                <motion.div key={m.id} className={`msg msg-${m.autor}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <p>
                    {m.autor === 'chef' ? <TextoAnimado texto={m.texto} animar={m.animar} onFim={rolar} /> : m.texto}
                  </p>
                  {m.acao && (
                    <button className="msg-acao" onClick={() => { irPara(m.acao.tab, { loja: m.acao.loja }); }}>
                      {m.acao.label} <ArrowRight size={14} aria-hidden="true" />
                    </button>
                  )}
                </motion.div>
              ))}
              {digitando && (
                <div className="msg msg-chef digitando" aria-label="Chef Hut está digitando">
                  <span /><span /><span />
                </div>
              )}
              <div ref={fim} />
            </div>

            <div className="chef-chips" aria-label="Perguntas sugeridas">
              {SUGESTOES.map((s) => (
                <button key={s} onClick={() => perguntar(s)} disabled={digitando}>
                  {s}
                </button>
              ))}
            </div>

            <form
              className="chef-form"
              onSubmit={(e) => {
                e.preventDefault()
                perguntar(texto)
              }}
            >
              <input ref={campo} value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Pergunte ao Chef Hut" aria-label="Escreva sua pergunta" maxLength={200} />
              <button type="submit" aria-label="Enviar pergunta" disabled={!texto.trim() || digitando}>
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {balao && !aberto && (
          <motion.button className="chef-balao" onClick={() => setAberto(true)} initial={{ opacity: 0, x: 12, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
            Posso ajudar?
          </motion.button>
        )}
      </AnimatePresence>

      <motion.button
        className="chef-avatar"
        onClick={() => setAberto((a) => !a)}
        aria-label={aberto ? 'Fechar o Chef Hut' : 'Abrir o Chef Hut, assistente do painel'}
        aria-expanded={aberto}
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2.8, type: 'spring', stiffness: 260, damping: 18 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
      >
        <ChefAvatar />
      </motion.button>
    </div>
  )
}
