import { Moon, Play, Sun } from 'lucide-react'
import logo from '../assets/logo-pizzahut.png'
import { useTheme } from '../theme/ThemeProvider'
import { useDash } from '../state/DashContext'
import { PERIODOS } from '../data/metrics'
import { dataLonga } from '../data/format'
import Segmented from './Segmented'
import ExportButton from './ExportButton'

const OPCOES_LOJA = [
  { id: 'all', label: 'Todas' },
  { id: 'h', label: 'Holandeses' },
  { id: 'r', label: 'Renascença' },
]
const OPCOES_PERIODO = Object.entries(PERIODOS).map(([id, p]) => ({ id, label: p.label }))

export default function Topbar() {
  const { theme, toggle } = useTheme()
  const { loja, setLoja, periodo, setPeriodo, setPresenting, ultimaCarga } = useDash()
  return (
    <header className="topbar">
      <div className="topbar-squares" aria-hidden="true">
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} style={{ animationDelay: `${(i % 6) * 0.4}s` }} />
        ))}
      </div>
      <div className="topbar-marca">
        <span className="logo-pill">
          <img src={logo} alt="Pizza Hut" />
        </span>
        <div>
          <h1>Painel de gestão</h1>
          <p>
            Holandeses × Renascença · carga de {dataLonga(ultimaCarga.data)}, {ultimaCarga.hora}
          </p>
        </div>
      </div>
      <div className="topbar-filtros">
        <Segmented valor={loja} opcoes={OPCOES_LOJA} onChange={setLoja} grupo="loja" rotulo="Loja" />
        <Segmented valor={periodo} opcoes={OPCOES_PERIODO} onChange={setPeriodo} grupo="periodo" rotulo="Período" />
      </div>
      <div className="topbar-acoes">
        <button className="btn-top" onClick={() => setPresenting(true)}>
          <Play size={16} aria-hidden="true" />
          <span className="btn-rot">Apresentar</span>
        </button>
        <ExportButton />
        <button
          className="btn-top btn-icone"
          onClick={toggle}
          aria-label={theme === 'dark' ? 'Mudar para o tema claro' : 'Mudar para o tema escuro'}
          title={theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
        >
          {theme === 'dark' ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
        </button>
      </div>
    </header>
  )
}
