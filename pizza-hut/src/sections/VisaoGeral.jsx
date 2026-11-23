import { useMemo } from 'react'
import { CircleDollarSign, Percent, ShoppingBag, Timer, Trash2 } from 'lucide-react'
import { useRecorte } from '../state/DashContext'
import { useTheme } from '../theme/ThemeProvider'
import { selecionar, serie, somaCampo, somar, porDiaSemana, variacao } from '../data/metrics'
import { CMV_MAX, CMV_MIN, DIAS } from '../data/daily'
import { sinais } from '../data/alertas'
import { brl, brlCent, brlCompacto, int, min, pct } from '../data/format'
import Card from '../components/Card'
import KpiCard from '../components/KpiCard'
import Chart, { eixoCat, eixoVal, grade, legenda, lojasVisiveis, serieBarra, serieLinha } from '../components/Chart'
import Comparativo from '../components/Comparativo'
import AlertList from '../components/AlertList'

export default function VisaoGeral() {
  const { c } = useTheme()
  const { loja, periodo, label, rows, atual, anterior } = useRecorte()
  const alertas = useMemo(() => sinais(loja), [loja])
  const vis = lojasVisiveis(loja)

  const fat = serie(rows, somaCampo('bruto'), periodo)
  const totais = fat.datas.map((_, i) => (fat.h[i] || 0) + (fat.r[i] || 0))
  const sema = porDiaSemana(rows, 'pedidos')

  const h = somar(selecionar('h', periodo))
  const r = somar(selecionar('r', periodo))

  const statusCmv = atual.cmv > CMV_MAX ? { nivel: 'bad', texto: 'Acima do teto' } : atual.cmv >= CMV_MAX - 1.2 || atual.cmv < CMV_MIN ? { nivel: 'warn', texto: 'Atenção' } : { nivel: 'ok', texto: 'Na faixa' }

  return (
    <div className="secao">
      <div className="kpis">
        <KpiCard i={0} icone={CircleDollarSign} rotulo="Faturamento bruto" valor={atual.bruto} formato={(v) => brlCompacto(v)} delta={variacao(atual.bruto, anterior.bruto)} spark={totais} nota={`vs. ${label} anteriores`} />
        <KpiCard i={1} icone={ShoppingBag} rotulo="Pedidos" valor={atual.pedidos} formato={(v) => int(v)} delta={variacao(atual.pedidos, anterior.pedidos)} nota={`nos últimos ${label}`} />
        <KpiCard i={2} icone={Percent} rotulo="Ticket médio" valor={atual.ticket} formato={(v) => brlCent(v)} delta={variacao(atual.ticket, anterior.ticket)} />
        <KpiCard i={3} icone={Percent} rotulo="CMV" valor={atual.cmv} formato={(v) => pct(v)} delta={variacao(atual.cmv, anterior.cmv)} inverso status={statusCmv} nota="faixa de 28% a 32%" />
        <KpiCard i={4} icone={Timer} rotulo="Pedido até despacho" valor={atual.tempo} formato={(v) => min(v)} delta={variacao(atual.tempo, anterior.tempo)} inverso nota={`meta de 15 min, ${pct(atual.dentro, 0)} dentro`} />
        <KpiCard i={5} icone={Trash2} rotulo="Desperdício" valor={atual.desperdicio} formato={(v) => brlCompacto(v)} delta={variacao(atual.desperdicio, anterior.desperdicio)} inverso nota={`${pct(atual.despPct, 2)} do faturamento`} />
      </div>

      <div className="grade g-2">
        <Card i={2} title="Faturamento diário" sub={`Bruto por loja, ${periodo === '12m' ? 'semanal' : 'diário'}`}>
          <Chart
            label={`Linhas de faturamento ${periodo === '12m' ? 'semanal' : 'diário'} por loja`}
            height={290}
            build={() => ({
              grid: grade(),
              legend: legenda(c),
              tooltip: { trigger: 'axis', valueFormatter: (v) => (v == null ? '-' : brl(v)) },
              xAxis: eixoCat(c, fat.labels, { boundaryGap: false, axisLabel: { color: c.muted, fontSize: 12, hideOverlap: true } }),
              yAxis: eixoVal(c, (v) => brlCompacto(v)),
              series: vis.map((l) => serieLinha(c, l, fat[l])),
            })}
          />
        </Card>
        <Card i={3} title="Sinais de atenção" sub="Amarelo pede olhar, vermelho pede ação" right={<span className="contagem">{alertas.length}</span>}>
          <AlertList itens={alertas} limite={5} />
        </Card>
      </div>

      <div className="grade g-2e">
        <Card i={4} title="Holandeses × Renascença" sub={`Mesmo período: ${label}`}>
          <Comparativo
            linhas={[
              { rotulo: 'Faturamento', h: h.bruto, r: r.bruto, fmt: brlCompacto, melhor: 'maior' },
              { rotulo: 'Pedidos', h: h.pedidos, r: r.pedidos, fmt: int, melhor: 'maior' },
              { rotulo: 'Ticket médio', h: h.ticket, r: r.ticket, fmt: brlCent, melhor: 'maior' },
              { rotulo: 'Pedido até despacho', h: h.tempo, r: r.tempo, fmt: min, melhor: 'menor' },
              { rotulo: 'CMV', h: h.cmv, r: r.cmv, fmt: pct, melhor: 'menor' },
              { rotulo: 'Desperdício', h: h.despPct, r: r.despPct, fmt: (v) => pct(v, 2), melhor: 'menor' },
            ]}
          />
        </Card>
        <Card i={5} title="Pedidos por dia da semana" sub="Média por dia no período">
          <Chart
            label="Barras de pedidos médios por dia da semana"
            height={300}
            build={() => ({
              grid: grade(),
              legend: legenda(c),
              tooltip: { trigger: 'axis', valueFormatter: (v) => `${int(v)} pedidos` },
              xAxis: eixoCat(c, DIAS),
              yAxis: eixoVal(c, (v) => int(v)),
              series: vis.map((l) => serieBarra(c, l, sema[l].map((v) => Math.round(v)))),
            })}
          />
        </Card>
      </div>
    </div>
  )
}
