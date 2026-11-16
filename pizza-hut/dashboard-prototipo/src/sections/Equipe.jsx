import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { BadgeCheck, Hourglass, Info, Sun, Moon } from 'lucide-react'
import { useRecorte } from '../state/DashContext'
import { useTheme } from '../theme/ThemeProvider'
import { EQUIPE, FUNCOES } from '../data/equipe'
import { LOJAS } from '../data/daily'
import { dec1, dec2, int } from '../data/format'
import Card, { Pill } from '../components/Card'
import Segmented from '../components/Segmented'
import Chart from '../components/Chart'

const OPCOES = Object.entries(FUNCOES).map(([id, f]) => ({ id, label: f.label }))

function norm(m, v) {
  const n = m.max === m.min ? 0.5 : (v - m.min) / (m.max - m.min)
  return Math.round((m.maior ? n : 1 - n) * 100)
}

function Anel({ valor }) {
  const r = 22
  const circ = 2 * Math.PI * r
  return (
    <svg className="anel" viewBox="0 0 56 56" aria-hidden="true">
      <circle cx="28" cy="28" r={r} className="anel-fundo" />
      <motion.circle cx="28" cy="28" r={r} className="anel-valor" strokeDasharray={circ} initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: circ * (1 - valor / 100) }} transition={{ duration: 1.1, ease: [0.2, 0.7, 0.2, 1] }} />
      <text x="28" y="33" textAnchor="middle" className="anel-txt">
        {valor}
      </text>
    </svg>
  )
}

export default function Equipe() {
  const { c } = useTheme()
  const { loja } = useRecorte()
  const [funcao, setFuncao] = useState('cozinha')
  const [sel, setSel] = useState(null)
  const [validadas, setValidadas] = useState(() => new Set())

  const def = FUNCOES[funcao]
  const grupo = useMemo(() => EQUIPE.filter((p) => p.funcao === funcao).sort((a, b) => b.score - a.score), [funcao])
  const lista = grupo.filter((p) => loja === 'all' || p.loja === loja)
  const atual = lista.find((p) => p.id === sel) || lista[0]
  const propostas = grupo.filter((p) => p.proposta)

  const alternar = (id) =>
    setValidadas((s) => {
      const n = new Set(s)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })

  const fmtMetrica = (m, v) => (m.k === 'notaCliente' ? dec2(v) : Number.isInteger(v) ? int(v) : dec1(v)) + m.un

  return (
    <div className="secao">
      <div className="banner banner-info">
        <Info size={18} aria-hidden="true" />
        <span>
          Comparações só acontecem <strong>dentro da mesma função</strong>. A pontuação leva em conta volume e turno, e uma métrica isolada não diz tudo sobre uma pessoa. <strong>Bonificação é só proposta</strong> e depende da validação do gestor. Nomes anonimizados.
        </span>
      </div>

      <div className="barra-filtro">
        <Segmented valor={funcao} opcoes={OPCOES} onChange={(f) => { setFuncao(f); setSel(null) }} grupo="funcao" rotulo="Função" escuro={false} />
        <span className="barra-nota">{lista.length ? `${lista.length} pessoas em ${def.label.toLowerCase()}` : 'Sem pessoas nesta função para a loja escolhida'}</span>
      </div>

      {lista.length > 0 && (
        <>
          <div className="grade g-2">
            <Card i={1} title={`Ranking de ${def.label.toLowerCase()}`} sub="Pontuação de 40 a 100, relativa ao grupo. Clique para ver o detalhe.">
              <ul className="equipe-lista">
                {lista.map((p, i) => (
                  <motion.li key={p.id} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.07 }}>
                    <button className={`equipe-item ${atual?.id === p.id ? 'on' : ''}`} onClick={() => setSel(p.id)}>
                      <span className="equipe-pos">{p.posicao}</span>
                      <Anel valor={p.score} />
                      <span className="equipe-info">
                        <strong>{p.nome}</strong>
                        <span>
                          {LOJAS[p.loja].nome} · {p.turno === 'Noite' ? <Moon size={12} aria-label="turno da noite" /> : <Sun size={12} aria-label="turno do almoço" />} {p.turno} · volume {int(p.volume)}
                        </span>
                      </span>
                      {p.proposta && <Pill>Proposta</Pill>}
                    </button>
                  </motion.li>
                ))}
              </ul>
            </Card>

            <Card i={2} title={atual?.nome} sub={`${atual ? LOJAS[atual.loja].nome : ''} · comparado com a média da função`}>
              {atual && (
                <>
                  <Chart
                    label={`Radar de ${atual.nome} contra a média da função`}
                    height={260}
                    build={() => ({
                      legend: { bottom: 0, itemWidth: 10, itemHeight: 10, textStyle: { color: c.muted } },
                      tooltip: {},
                      radar: {
                        radius: '62%',
                        center: ['50%', '46%'],
                        indicator: def.metricas.map((m) => ({ name: m.label.replace(' (%)', ''), max: 100 })),
                        axisName: { color: c.muted, fontSize: 12 },
                        splitLine: { lineStyle: { color: c.grid } },
                        splitArea: { show: false },
                        axisLine: { lineStyle: { color: c.grid } },
                      },
                      series: [
                        {
                          type: 'radar',
                          data: [
                            { name: 'Média da função', value: def.metricas.map((m) => norm(m, m.media)), lineStyle: { color: c.muted, type: 'dashed' }, itemStyle: { color: c.muted }, areaStyle: { opacity: 0 } },
                            { name: atual.nome, value: def.metricas.map((m) => norm(m, atual[m.k])), lineStyle: { color: c.primary, width: 3 }, itemStyle: { color: c.primary }, areaStyle: { color: c.primary, opacity: 0.18 } },
                          ],
                        },
                      ],
                    })}
                  />
                  <table className="tabela tabela-min">
                    <tbody>
                      {def.metricas.map((m) => (
                        <tr key={m.k}>
                          <td>{m.label}</td>
                          <td style={{ textAlign: 'right' }}><strong>{fmtMetrica(m, atual[m.k])}</strong></td>
                          <td style={{ textAlign: 'right' }} className="muted">média {fmtMetrica(m, m.media)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </Card>
          </div>

          <Card i={3} title="Proposta de bonificação" sub="Critério: pontuação de 80 ou mais e volume igual ou acima da mediana da função. Nada é concedido sem a validação do gestor." right={<Pill tom="gray">Simulação</Pill>}>
            {propostas.length === 0 ? (
              <p className="muted">Nenhuma pessoa atinge os critérios nesta função.</p>
            ) : (
              <ul className="propostas">
                {propostas.map((p) => {
                  const ok = validadas.has(p.id)
                  return (
                    <li key={p.id}>
                      <span className={`prop-icone ${ok ? 'ok' : ''}`} aria-hidden="true">{ok ? <BadgeCheck size={20} /> : <Hourglass size={20} />}</span>
                      <span className="prop-texto">
                        <strong>{p.nome}</strong>
                        <span>Pontuação {p.score}, volume {int(p.volume)}. {ok ? 'Validada pelo gestor (simulação).' : 'Aguardando validação do gestor.'}</span>
                      </span>
                      <button className={`btn-sec ${ok ? 'on' : ''}`} onClick={() => alternar(p.id)}>
                        {ok ? 'Desfazer' : 'Validar'}
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </Card>
        </>
      )}
    </div>
  )
}
