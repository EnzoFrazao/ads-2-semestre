import { useMemo } from 'react'
import { BadgePercent, Banknote, CircleDollarSign, Landmark, Receipt } from 'lucide-react'
import { useRecorte } from '../state/DashContext'
import { useTheme } from '../theme/ThemeProvider'
import { selecionar, somar, variacao } from '../data/metrics'
import { faturamentoMensal, chavesMes } from '../data/previsao'
import { CANAIS } from '../data/custos'
import { LOJAS } from '../data/daily'
import { brl, brlCompacto, dataLonga, int, pct } from '../data/format'
import Card, { Pill } from '../components/Card'
import KpiCard from '../components/KpiCard'
import DataTable from '../components/DataTable'
import Chart, { NOME_LOJA, eixoCat, eixoVal, grade, legenda, lojasVisiveis } from '../components/Chart'

export default function Faturamento() {
  const { c } = useTheme()
  const { loja, periodo, label, rows, atual, anterior } = useRecorte()
  const vis = lojasVisiveis(loja)
  const base = atual.bruto - atual.descontos

  const mensal12 = useMemo(() => {
    const ch = chavesMes(12)
    const porLoja = Object.fromEntries(vis.map((l) => [l, faturamentoMensal(l).itens.slice(0, 12)]))
    return { labels: ch.map((x) => x.label), porLoja }
  }, [vis.join()])

  const canais = CANAIS.map((k) => ({ name: k.nome, value: Math.round(atual.canal[k.id]) })).filter((x) => x.value > 0)

  const empilhado = vis.map((l) => ({ l, s: somar(selecionar(l, periodo)) }))

  const linhas = useMemo(
    () => [...rows].sort((a, b) => (a.date < b.date ? 1 : -1)).map((r) => ({ ...r, base: r.bruto - r.descontos })),
    [rows],
  )

  const colunas = [
    { k: 'date', rotulo: 'Data', render: (l) => dataLonga(l.date), valor: (l) => l.date },
    { k: 'loja', rotulo: 'Loja', render: (l) => LOJAS[l.loja].nome, valor: (l) => l.loja },
    { k: 'pedidos', rotulo: 'Pedidos', align: 'right', fmt: int },
    { k: 'bruto', rotulo: 'Bruto', align: 'right', fmt: brl },
    { k: 'descontos', rotulo: 'Descontos', align: 'right', fmt: brl },
    { k: 'taxas', rotulo: 'Taxas e comissões', align: 'right', fmt: brl },
    { k: 'liquido', rotulo: 'Líquido', align: 'right', fmt: brl },
    { k: 'base', rotulo: 'Base de cálculo', align: 'right', fmt: brl },
  ]
  const total = {
    date: 'Total do período',
    pedidos: int(atual.pedidos),
    bruto: brl(atual.bruto),
    descontos: brl(atual.descontos),
    taxas: brl(atual.taxas),
    liquido: brl(atual.liquido),
    base: brl(base),
  }

  return (
    <div className="secao">
      <div className="kpis">
        <KpiCard i={0} icone={CircleDollarSign} rotulo="Faturamento bruto" valor={atual.bruto} formato={brlCompacto} delta={variacao(atual.bruto, anterior.bruto)} nota={`${label}`} />
        <KpiCard i={1} icone={BadgePercent} rotulo="Descontos" valor={atual.descontos} formato={brlCompacto} delta={variacao(atual.descontos, anterior.descontos)} inverso nota={`${pct((atual.descontos / atual.bruto) * 100)} do bruto`} />
        <KpiCard i={2} icone={Receipt} rotulo="Taxas e comissões" valor={atual.taxas} formato={brlCompacto} delta={variacao(atual.taxas, anterior.taxas)} inverso nota="iFood e cartões" />
        <KpiCard i={3} icone={Banknote} rotulo="Faturamento líquido" valor={atual.liquido} formato={brlCompacto} delta={variacao(atual.liquido, anterior.liquido)} nota={`${pct((atual.liquido / atual.bruto) * 100)} do bruto`} />
        <KpiCard i={4} icone={Landmark} rotulo="Base para impostos" valor={base} formato={brlCompacto} nota="bruto menos descontos" />
      </div>

      <div className="grade g-2e">
        <Card i={1} title="Do bruto ao líquido" sub="Para onde vai cada real vendido">
          <Chart
            label="Barras empilhadas do faturamento líquido, taxas e descontos por loja"
            height={260}
            build={() => ({
              grid: grade({ left: 10, right: 44 }),
              legend: legenda(c),
              tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, valueFormatter: (v) => brl(v) },
              xAxis: eixoVal(c, (v) => brlCompacto(v)),
              yAxis: eixoCat(c, empilhado.map((e) => NOME_LOJA[e.l]), { inverse: true }),
              series: [
                { name: 'Líquido', key: 'liquido', color: c.ok },
                { name: 'Taxas e comissões', key: 'taxas', color: c.warn },
                { name: 'Descontos', key: 'descontos', color: c.bad },
              ].map((s, i) => ({
                name: s.name,
                type: 'bar',
                stack: 'bruto',
                barMaxWidth: 34,
                data: empilhado.map((e) => Math.round(e.s[s.key])),
                itemStyle: { color: s.color, borderColor: c.card, borderWidth: 2, borderRadius: i === 2 ? [0, 6, 6, 0] : 0 },
              })),
            })}
          />
        </Card>
        <Card i={2} title="Faturamento por canal" sub={`Bruto nos últimos ${label}`}>
          <Chart
            label="Rosca do faturamento por canal de venda"
            height={260}
            build={() => ({
              legend: { ...legenda(c), top: 'middle', right: 0, orient: 'vertical' },
              tooltip: { trigger: 'item', formatter: (p) => `${p.name}<br/><b>${brl(p.value)}</b> (${p.percent}%)` },
              series: [
                {
                  type: 'pie',
                  radius: ['52%', '78%'],
                  center: ['38%', '52%'],
                  avoidLabelOverlap: true,
                  itemStyle: { borderColor: c.card, borderWidth: 3, borderRadius: 6 },
                  label: { show: false },
                  emphasis: { scale: true, scaleSize: 6 },
                  animationType: 'expansion',
                  data: canais.map((x, i) => ({ ...x, itemStyle: { color: c.series[i % c.series.length] } })),
                },
              ],
            })}
          />
        </Card>
      </div>

      <Card i={3} title="Sazonalidade mês a mês" sub="Faturamento bruto dos últimos 12 meses; a linha mostra o mesmo mês do ano anterior">
        <Chart
          label="Barras do faturamento mensal dos últimos 12 meses e linha do ano anterior"
          height={280}
          build={() => ({
            grid: grade(),
            legend: legenda(c),
            tooltip: { trigger: 'axis', valueFormatter: (v) => brl(v) },
            xAxis: eixoCat(c, mensal12.labels),
            yAxis: eixoVal(c, (v) => brlCompacto(v)),
            series: [
              ...vis.map((l) => ({
                name: NOME_LOJA[l],
                type: 'bar',
                stack: 'mes',
                barMaxWidth: 30,
                data: mensal12.porLoja[l].map((m) => Math.round(m.valor)),
                itemStyle: { color: l === 'h' ? c.h : c.r, borderColor: c.card, borderWidth: 1 },
              })),
              {
                name: 'Mesmo mês, ano anterior',
                type: 'line',
                smooth: 0.25,
                symbol: 'circle',
                symbolSize: 7,
                lineStyle: { color: c.warn, width: 2.5, type: 'dotted' },
                itemStyle: { color: c.warn },
                data: mensal12.labels.map((_, i) => Math.round(vis.reduce((a, l) => a + mensal12.porLoja[l][i].anterior, 0))),
              },
            ],
          })}
        />
      </Card>

      <Card
        i={4}
        title="Detalhamento diário"
        sub="Base para a apuração dos impostos do início do ano. A base de cálculo é uma conta simples (bruto menos descontos), a regra fiscal ainda precisa ser validada com a contabilidade."
        right={<Pill>{rows.length} linhas</Pill>}
        flush
      >
        <DataTable colunas={colunas} linhas={linhas} total={total} chave={(l, i) => `${l.date}-${l.loja}-${i}`} maxAltura={420} />
      </Card>
    </div>
  )
}
