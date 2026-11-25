import { useMemo } from 'react'
import { CalendarDays, CircleDollarSign, Crown, Pizza, ShoppingBag } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRecorte } from '../state/DashContext'
import { useTheme } from '../theme/ThemeProvider'
import { porDiaSemana, mensal, serie, variacao } from '../data/metrics'
import { DIAS } from '../data/daily'
import { SABORES } from '../data/custos'
import { chavesMes } from '../data/previsao'
import { brlCent, brlCompacto, int } from '../data/format'
import PicoPedidos from '../components/PicoPedidos'
import Card from '../components/Card'
import KpiCard from '../components/KpiCard'
import Chart, { NOME_LOJA, eixoCat, eixoVal, grade, legenda, lojasVisiveis, serieBarra, serieLinha } from '../components/Chart'

export default function VendasMix() {
  const { c } = useTheme()
  const { loja, periodo, label, rows, atual, anterior } = useRecorte()
  const vis = lojasVisiveis(loja)

  const sema = porDiaSemana(rows, 'bruto')
  const semaTotal = DIAS.map((_, i) => vis.reduce((a, l) => a + (sema[l][i] || 0), 0))
  const diaForte = DIAS[semaTotal.indexOf(Math.max(...semaTotal))]

  const meses = useMemo(() => chavesMes(12), [])
  const pedMes = Object.fromEntries(vis.map((l) => [l, mensal(l, 'pedidos')]))
  const mesTotais = meses.map((m) => vis.reduce((a, l) => a + (pedMes[l][m.chave] || 0), 0))
  const mesForte = meses[mesTotais.indexOf(Math.max(...mesTotais))].label

  const ticketSerie = serie(rows, (g) => g.reduce((a, r) => a + r.bruto, 0) / g.reduce((a, r) => a + r.pedidos, 0), periodo)

  // ranking de sabores: participação por loja aplicada aos pedidos do período
  const ranking = useMemo(() => {
    const pedidosPorLoja = { h: 0, r: 0 }
    for (const r of rows) pedidosPorLoja[r.loja] += r.pedidos
    return SABORES.map((s) => ({ nome: s.nome, h: s.h, r: s.r, total: vis.reduce((a, l) => a + (s[l] / 100) * pedidosPorLoja[l], 0) }))
      .sort((a, b) => b.total - a.total)
  }, [rows, vis.join()])
  const maxRank = ranking[0]?.total || 1

  return (
    <div className="secao">
      <div className="kpis">
        <KpiCard i={0} icone={ShoppingBag} rotulo="Pedidos" valor={atual.pedidos} formato={int} delta={variacao(atual.pedidos, anterior.pedidos)} nota={`nos últimos ${label}`} />
        <KpiCard i={1} icone={CircleDollarSign} rotulo="Ticket médio" valor={atual.ticket} formato={brlCent} delta={variacao(atual.ticket, anterior.ticket)} />
        <KpiCard i={2} icone={Pizza} rotulo="Sabor líder" valor={ranking[0]?.total || 0} formato={(v) => `${int(v)}`} nota={`${ranking[0]?.nome}, pedidos estimados`} />
        <KpiCard i={3} icone={CalendarDays} rotulo="Dia mais forte" valor={0} formato={() => diaForte} nota="maior faturamento médio" />
        <KpiCard i={4} icone={Crown} rotulo="Mês mais forte" valor={0} formato={() => mesForte} nota="entre os últimos 12 meses" />
      </div>

      <div className="grade g-2">
        <Card i={1} title="Sabores que mais saem" sub="Ranking por pedidos estimados no período. O mix por sabor vem da amostra do sistema.">
          <ol className="ranking">
            {ranking.map((s, i) => (
              <li key={s.nome}>
                <span className={`ranking-pos pos-${i + 1}`}>{i + 1}</span>
                <span className="ranking-nome">{s.nome}</span>
                <div className="ranking-barra">
                  <motion.span initial={{ width: 0 }} animate={{ width: `${(s.total / maxRank) * 100}%` }} transition={{ delay: 0.2 + i * 0.07, duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }} />
                </div>
                <strong>{int(s.total)}</strong>
              </li>
            ))}
          </ol>
        </Card>
        <Card i={2} title="Faturamento médio por dia da semana" sub="Média por dia, no período">
          <Chart
            label="Barras do faturamento médio por dia da semana"
            height={360}
            build={() => ({
              grid: grade(),
              legend: legenda(c),
              tooltip: { trigger: 'axis', valueFormatter: (v) => brlCompacto(v) },
              xAxis: eixoCat(c, DIAS),
              yAxis: eixoVal(c, (v) => brlCompacto(v)),
              series: vis.map((l) => serieBarra(c, l, sema[l].map((v) => Math.round(v)))),
            })}
          />
        </Card>
      </div>

      <div className="grade g-2e">
        <Card i={3} title="Pedidos por mês" sub="Últimos 12 meses fechados">
          <Chart
            label="Barras de pedidos por mês nos últimos 12 meses"
            height={280}
            build={() => ({
              grid: grade(),
              legend: legenda(c),
              tooltip: { trigger: 'axis', valueFormatter: (v) => `${int(v)} pedidos` },
              xAxis: eixoCat(c, meses.map((m) => m.label)),
              yAxis: eixoVal(c, (v) => int(v)),
              series: vis.map((l) => serieBarra(c, l, meses.map((m) => Math.round(pedMes[l][m.chave] || 0)), { barMaxWidth: 18 })),
            })}
          />
        </Card>
        <Card i={4} title="Ticket médio no tempo" sub="Valor médio por pedido">
          <Chart
            label="Linha do ticket médio por loja"
            height={280}
            build={() => ({
              grid: grade(),
              legend: legenda(c),
              tooltip: { trigger: 'axis', valueFormatter: (v) => (v == null ? '-' : brlCent(v)) },
              xAxis: eixoCat(c, ticketSerie.labels, { boundaryGap: false, axisLabel: { color: c.muted, fontSize: 12, hideOverlap: true } }),
              yAxis: eixoVal(c, (v) => `R$ ${Math.round(v)}`, { scale: true }),
              series: vis.map((l) => serieLinha(c, l, ticketSerie[l].map((v) => (v == null ? null : Number(v.toFixed(2)))), { areaStyle: undefined })),
            })}
          />
        </Card>
      </div>
      <PicoPedidos i={5} />
      <p className="nota-fim">
        {vis.map((l) => NOME_LOJA[l]).join(' e ')}: dados fictícios. O mix por sabor é uma amostra de demonstração, ainda não vem do sistema real.
      </p>
    </div>
  )
}
