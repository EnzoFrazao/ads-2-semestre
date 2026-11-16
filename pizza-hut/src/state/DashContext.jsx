import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { ULTIMA_CARGA } from '../data/daily'
import { selecionar, somar, PERIODOS } from '../data/metrics'

export const TABS = [
  { id: 'geral', label: 'Visão geral', icone: 'LayoutDashboard' },
  { id: 'entrega', label: 'Entrega e iFood', icone: 'Bike' },
  { id: 'faturamento', label: 'Faturamento', icone: 'Wallet' },
  { id: 'desperdicio', label: 'Desperdício e CMV', icone: 'Trash2' },
  { id: 'vendas', label: 'Vendas e mix', icone: 'Pizza' },
  { id: 'estoque', label: 'Estoque e previsões', icone: 'Boxes' },
  { id: 'equipe', label: 'Equipe', icone: 'Users' },
  { id: 'dados', label: 'Dados e carga', icone: 'DatabaseZap' },
]

const Ctx = createContext(null)

export function DashProvider({ children }) {
  const [loja, setLoja] = useState('all')
  const [periodo, setPeriodo] = useState('30d')
  const [tab, setTab] = useState('geral')
  const [presenting, setPresenting] = useState(false)
  const [ultimaCarga, setUltimaCarga] = useState(ULTIMA_CARGA)

  const irPara = useCallback((id, opcoes = {}) => {
    setTab(id)
    if (opcoes.loja) setLoja(opcoes.loja)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const value = useMemo(
    () => ({ loja, setLoja, periodo, setPeriodo, tab, setTab, irPara, presenting, setPresenting, ultimaCarga, setUltimaCarga }),
    [loja, periodo, tab, presenting, ultimaCarga, irPara],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useDash = () => useContext(Ctx)

// Linhas do período atual e do anterior, já somadas, conforme os filtros
export function useRecorte() {
  const { loja, periodo } = useDash()
  return useMemo(() => {
    const rows = selecionar(loja, periodo)
    const prevRows = selecionar(loja, periodo, 1)
    return { loja, periodo, label: PERIODOS[periodo].label, rows, prevRows, atual: somar(rows), anterior: somar(prevRows) }
  }, [loja, periodo])
}
