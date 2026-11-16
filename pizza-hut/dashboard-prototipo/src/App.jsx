import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { ThemeProvider } from './theme/ThemeProvider'
import { DashProvider, useDash } from './state/DashContext'
import Topbar from './components/Topbar'
import Tabs from './components/Tabs'
import Splash from './components/Splash'
import ModoApresentacao from './components/ModoApresentacao'
import ChefHut from './chef/ChefHut'
import VisaoGeral from './sections/VisaoGeral'
import EntregaIfood from './sections/EntregaIfood'
import Faturamento from './sections/Faturamento'
import DesperdicioCmv from './sections/DesperdicioCmv'
import VendasMix from './sections/VendasMix'
import EstoquePrevisoes from './sections/EstoquePrevisoes'
import Equipe from './sections/Equipe'
import DadosCarga from './sections/DadosCarga'

const SECOES = {
  geral: VisaoGeral,
  entrega: EntregaIfood,
  faturamento: Faturamento,
  desperdicio: DesperdicioCmv,
  vendas: VendasMix,
  estoque: EstoquePrevisoes,
  equipe: Equipe,
  dados: DadosCarga,
}

function Shell() {
  const { tab, loja, periodo } = useDash()
  const Secao = SECOES[tab]
  return (
    <>
      <Splash />
      <Topbar />
      <Tabs />
      <main className="conteudo" id="conteudo">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }}>
            {/* a chave de filtros refaz os gráficos e repete a animação de entrada */}
            <Secao key={`${loja}-${periodo}`} />
          </motion.div>
        </AnimatePresence>
        <footer className="rodape">
          Protótipo com dados fictícios, calibrados com o briefing de 20/10/2026. Não representam resultados reais das lojas.
        </footer>
      </main>
      <ModoApresentacao />
      <ChefHut />
    </>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <DashProvider>
          <Shell />
        </DashProvider>
      </ThemeProvider>
    </MotionConfig>
  )
}
