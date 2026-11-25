import { useTheme } from '../theme/ThemeProvider'
import { useRecorte } from '../state/DashContext'
import { DAILY, DIAS, END, addDays, dowOf } from '../data/daily'
import { dataCurta, dec1, min, sinal } from '../data/format'
import { variacao } from '../data/metrics'
import Card from './Card'
import Chart, { NOME_LOJA, eixoCat, eixoVal, grade, legenda, lojasVisiveis } from './Chart'

// Tempo até o despacho: últimos 7 dias contra os 7 dias anteriores, dia da semana a dia da semana.
const tempoDoDia = (data, lojas) => {
  const g = DAILY.filter((r) => r.date === data && lojas.includes(r.loja))
  const p = g.reduce((a, r) => a + r.pedidos, 0)
  return p ? g.reduce((a, r) => a + r.tempo * r.pedidos, 0) / p : null
}
const mediaSemana = (v) => {
  const ok = v.filter((x) => x != null)
  return ok.length ? ok.reduce((a, b) => a + b, 0) / ok.length : 0
}

export default function ComparativoSemana({ i = 0 }) {
  const { c } = useTheme()
  const { loja } = useRecorte()
  const lojas = lojasVisiveis(loja)
  const dias = Array.from({ length: 7 }, (_, k) => addDays(END, -6 + k))
  const atual = dias.map((d) => tempoDoDia(d, lojas))
  const anterior = dias.map((d) => tempoDoDia(addDays(d, -7), lojas))
  const v = variacao(mediaSemana(atual), mediaSemana(anterior))
  const melhor = v < 0
  const nome = lojas.length === 2 ? 'das duas lojas' : `de ${NOME_LOJA[lojas[0]]}`

  return (
    <Card
      i={i}
      title="Tempo de despacho: semana contra semana"
      sub={`Cada dia contra o mesmo dia da semana anterior, ${nome}. Média da semana: ${dec1(mediaSemana(atual))} min, ${sinal(v)} (${melhor ? 'melhorou' : v === 0 ? 'igual' : 'piorou'}).`}
    >
      <Chart
        label="Linhas do tempo de despacho dos últimos 7 dias contra os 7 dias anteriores"
        height={270}
        build={() => ({
          grid: grade(),
          legend: legenda(c),
          tooltip: { trigger: 'axis', valueFormatter: (x) => (x == null ? '-' : min(x)) },
          xAxis: eixoCat(c, dias.map((d) => `${DIAS[dowOf(d)]} ${dataCurta(d)}`), { boundaryGap: false, axisLabel: { color: c.muted, fontSize: 11 } }),
          yAxis: eixoVal(c, (x) => `${x}`, { min: 0 }),
          series: [
            { name: 'Semana anterior', type: 'line', data: anterior.map((x) => x && Number(x.toFixed(1))), showSymbol: false, lineStyle: { width: 2, type: 'dashed', color: c.muted }, itemStyle: { color: c.muted } },
            { name: 'Últimos 7 dias', type: 'line', data: atual.map((x) => x && Number(x.toFixed(1))), smooth: 0.2, lineStyle: { width: 3, color: c.primary }, itemStyle: { color: c.primary } },
          ],
        })}
      />
    </Card>
  )
}
