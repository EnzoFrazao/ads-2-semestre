import { motion } from 'framer-motion'
import { Lightbulb, Percent, Package, Trash2, TriangleAlert } from 'lucide-react'
import { useRecorte } from '../state/DashContext'
import { useTheme } from '../theme/ThemeProvider'
import { selecionar, serie, somar, variacao } from '../data/metrics'
import { CMV_MAX, CMV_MIN } from '../data/daily'
import { DESP_CAUSAS, DESP_TIPOS } from '../data/custos'
import { brl, brlCompacto, dec1, pct } from '../data/format'
import Card, { Status } from '../components/Card'
import KpiCard from '../components/KpiCard'
import Chart, { NOME_LOJA, eixoCat, eixoVal, grade, legenda, lojasVisiveis, serieLinha } from '../components/Chart'

const ESCALA = [20, 40]
const pos = (v) => `${((v - ESCALA[0]) / (ESCALA[1] - ESCALA[0])) * 100}%`

function nivelCmv(v) {
  if (v > CMV_MAX) return 'bad'
  if (v >= CMV_MAX - 1.2 || v < CMV_MIN) return 'warn'
  return 'ok'
}

function FaixaCmv({ rotulo, valor, i }) {
  const nivel = nivelCmv(valor)
  const texto = { ok: 'Dentro da faixa', warn: valor < CMV_MIN ? 'Abaixo da faixa' : 'Perto do teto', bad: 'Acima do teto' }[nivel]
  return (
    <div className="faixa">
      <div className="faixa-topo">
        <span>{rotulo}</span>
        <strong>{pct(valor)}</strong>
        <Status nivel={nivel}>{texto}</Status>
      </div>
      <div className="faixa-trilho">
        <span className="faixa-ok" style={{ left: pos(CMV_MIN), width: `calc(${pos(CMV_MAX)} - ${pos(CMV_MIN)})` }} />
        <motion.span className="faixa-marca" initial={{ left: '0%' }} animate={{ left: pos(valor) }} transition={{ delay: 0.3 + i * 0.2, duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }} />
      </div>
      <div className="faixa-escala" aria-hidden="true">
        {[20, CMV_MIN, CMV_MAX, 40].map((v) => (
          <span key={v} style={{ left: pos(v) }}>
            {v}%
          </span>
        ))}
      </div>
    </div>
  )
}

const mediaCmv = (g) => {
  const b = g.reduce((a, r) => a + r.bruto, 0)
  return b ? (g.reduce((a, r) => a + r.cmvValor, 0) / b) * 100 : null
}

export default function DesperdicioCmv() {
  const { c } = useTheme()
  const { loja, periodo, label, rows, atual, anterior } = useRecorte()
  const vis = lojasVisiveis(loja)
  const cmvSerie = serie(rows, mediaCmv, periodo)

  const porLoja = vis.map((l) => ({ l, s: somar(selecionar(l, periodo)) }))
  const maiorCausa = DESP_CAUSAS[0]
  const massa = atual.desperdicio * DESP_TIPOS[0].share
  const ideal = 1.8
  const ganho = Math.max(0, atual.despPct - ideal)

  return (
    <div className="secao">
      <div className="kpis">
        <KpiCard i={0} icone={Trash2} rotulo="Desperdício total" valor={atual.desperdicio} formato={brlCompacto} delta={variacao(atual.desperdicio, anterior.desperdicio)} inverso nota={`${pct(atual.despPct, 2)} do faturamento`} />
        <KpiCard i={1} icone={Percent} rotulo="CMV" valor={atual.cmv} formato={(v) => pct(v)} delta={variacao(atual.cmv, anterior.cmv)} inverso status={{ nivel: nivelCmv(atual.cmv), texto: { ok: 'Na faixa', warn: 'Atenção', bad: 'Acima do teto' }[nivelCmv(atual.cmv)] }} nota="faixa de 28% a 32%" />
        <KpiCard i={2} icone={Package} rotulo="Perda de massa" valor={massa} formato={brlCompacto} nota="38% do desperdício" />
        <KpiCard i={3} icone={TriangleAlert} rotulo="Maior causa" valor={maiorCausa.share * 100} formato={(v) => `${Math.round(v)}%`} nota={maiorCausa.nome} />
      </div>

      <div className="grade g-2">
        <Card i={1} title="CMV por loja" sub="Faixa aceita pelo gestor: 28% a 32%. Acima disso é desperdício ou perda.">
          <div className="faixas">
            {porLoja.map((p, i) => (
              <FaixaCmv key={p.l} i={i} rotulo={NOME_LOJA[p.l]} valor={p.s.cmv} />
            ))}
          </div>
          <Chart
            label="Linha do CMV por loja com a faixa de 28% a 32%"
            height={220}
            build={() => ({
              grid: grade({ top: 30 }),
              legend: legenda(c),
              tooltip: { trigger: 'axis', valueFormatter: (v) => (v == null ? '-' : pct(v)) },
              xAxis: eixoCat(c, cmvSerie.labels, { boundaryGap: false, axisLabel: { color: c.muted, fontSize: 12, hideOverlap: true } }),
              yAxis: eixoVal(c, (v) => `${v}%`, { min: 24, max: 36 }),
              series: vis.map((l, idx) =>
                serieLinha(c, l, cmvSerie[l].map((v) => (v == null ? null : Number(v.toFixed(2)))), {
                  areaStyle: undefined,
                  ...(idx === 0 ? { markArea: { silent: true, itemStyle: { color: c.ok, opacity: 0.12 }, data: [[{ yAxis: CMV_MIN }, { yAxis: CMV_MAX }]] } } : {}),
                }),
              ),
            })}
          />
        </Card>
        <Card i={2} title="O que mexe no CMV" sub="Leitura simples, não é diagnóstico">
          <ul className="insights">
            <li>
              <Lightbulb size={18} aria-hidden="true" />
              <span>
                O desperdício está em <strong>{pct(atual.despPct, 2)}</strong> do faturamento. Voltar para {pct(ideal, 1)} reduziria o CMV em cerca de <strong>{dec1(ganho)} ponto percentual</strong>.
              </span>
            </li>
            <li>
              <Lightbulb size={18} aria-hidden="true" />
              <span>
                A massa responde por <strong>38%</strong> do que é jogado fora. A projeção de massas na aba <em>Estoque e previsões</em> ajuda a reduzir essa perda.
              </span>
            </li>
            <li>
              <Lightbulb size={18} aria-hidden="true" />
              <span>
                <strong>{maiorCausa.nome}</strong> é a principal causa ({Math.round(maiorCausa.share * 100)}%). Controle de validade por lote costuma pesar mais que treinamento.
              </span>
            </li>
          </ul>
        </Card>
      </div>

      <div className="grade g-2e">
        <Card i={3} title="Desperdício por tipo" sub={`Valor jogado fora nos últimos ${label}`}>
          <Chart
            label="Mapa de árvore do desperdício por tipo de insumo"
            height={290}
            build={() => ({
              tooltip: { formatter: (p) => `${p.name}<br/><b>${brl(p.value)}</b>` },
              series: [
                {
                  type: 'treemap',
                  roam: false,
                  nodeClick: false,
                  breadcrumb: { show: false },
                  width: '100%',
                  height: '100%',
                  top: 4,
                  bottom: 4,
                  left: 0,
                  right: 0,
                  label: { show: true, color: '#fff', fontSize: 13, fontFamily: 'Source Sans 3', formatter: (p) => `${p.name}\n${brlCompacto(p.value)}`, overflow: 'truncate' },
                  itemStyle: { borderColor: c.card, borderWidth: 3, gapWidth: 3, borderRadius: 8 },
                  data: DESP_TIPOS.map((t, i) => ({ name: t.nome, value: Math.round(atual.desperdicio * t.share), itemStyle: { color: [c.primary, '#A02020', '#701818', '#5B5B5B', '#7A7A7A', '#8B3A3A', '#9A9A9A'][i] } })),
                },
              ],
            })}
          />
        </Card>
        <Card i={4} title="Desperdício por causa" sub="Por que o insumo foi descartado">
          <Chart
            label="Barras horizontais do desperdício por causa"
            height={290}
            build={() => ({
              grid: grade({ left: 10, right: 64 }),
              tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, valueFormatter: (v) => brl(v) },
              xAxis: eixoVal(c, (v) => brlCompacto(v)),
              yAxis: eixoCat(c, DESP_CAUSAS.map((x) => x.nome), { inverse: true }),
              series: [
                {
                  type: 'bar',
                  barMaxWidth: 22,
                  label: { show: true, position: 'right', color: c.muted, formatter: (p) => brlCompacto(p.value) },
                  data: DESP_CAUSAS.map((x, i) => ({ value: Math.round(atual.desperdicio * x.share), itemStyle: { color: i === 0 ? c.primary : c.series[3], borderRadius: [0, 6, 6, 0] } })),
                },
              ],
            })}
          />
        </Card>
      </div>

      <Card i={5} title="Desperdício por loja e por tipo" sub="Compara onde o problema pesa mais">
        <Chart
          label="Barras empilhadas do desperdício por tipo em cada loja"
          height={230}
          build={() => ({
            grid: grade({ left: 10, top: 34, right: 40 }),
            legend: legenda(c),
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, valueFormatter: (v) => brl(v) },
            xAxis: eixoVal(c, (v) => brlCompacto(v)),
            yAxis: eixoCat(c, porLoja.map((p) => NOME_LOJA[p.l]), { inverse: true }),
            series: DESP_TIPOS.map((t, i) => ({
              name: t.nome,
              type: 'bar',
              stack: 'tipo',
              barMaxWidth: 34,
              data: porLoja.map((p) => Math.round(p.s.desperdicio * t.share)),
              itemStyle: { color: [c.primary, '#A02020', '#701818', '#5B5B5B', '#7A7A7A', '#8B3A3A', '#9A9A9A'][i], borderColor: c.card, borderWidth: 2 },
            })),
          })}
        />
      </Card>
    </div>
  )
}
