import { useMemo } from 'react'
import { useTheme } from '../theme/ThemeProvider'
import { useRecorte } from '../state/DashContext'
import { DAILY, DIAS, END, HORAS, addDays } from '../data/daily'
import { int } from '../data/format'
import Card from './Card'
import Chart, { lojasVisiveis } from './Chart'

// Participação de cada hora (18h a 23h) no total de pedidos do dia. Fictícia, para o protótipo.
const PESO_HORA = [0.12, 0.2, 0.26, 0.2, 0.14, 0.08]

// Pedidos por hora, por dia da semana, médios das últimas 4 semanas.
export function pedidosPorHora(lojas) {
  const ini = addDays(END, -27)
  const soma = Array(7).fill(0)
  const dias = Array(7).fill(0)
  const datas = new Set()
  for (const r of DAILY) {
    if (r.date < ini || !lojas.includes(r.loja)) continue
    soma[r.dow] += r.pedidos
    if (!datas.has(r.date)) {
      datas.add(r.date)
      dias[r.dow] += 1
    }
  }
  return soma.map((s, d) => PESO_HORA.map((p) => Math.round((s / (dias[d] || 1)) * p)))
}

export default function PicoPedidos({ i = 0 }) {
  const { c } = useTheme()
  const { loja } = useRecorte()
  const lojas = lojasVisiveis(loja)
  const m = useMemo(() => pedidosPorHora(lojas), [lojas.join()])
  let top = { v: 0, d: 0, h: 0 }
  m.forEach((l, d) => l.forEach((v, h) => v > top.v && (top = { v, d, h })))
  const max = top.v || 1

  return (
    <Card i={i} title="Horários de pico" sub={`Pedidos por hora, média das últimas 4 semanas. O maior pico é ${DIAS[top.d].toLowerCase()} às ${HORAS[top.h]}, com ${int(top.v)} pedidos na hora: use para dimensionar cozinha e motoboys.`}>
      <Chart
        label="Mapa de calor de pedidos por dia da semana e horário"
        height={270}
        build={() => {
          const dados = []
          m.forEach((l, d) => l.forEach((v, h) => dados.push([h, d, v])))
          return {
            grid: { left: 44, right: 6, top: 4, bottom: 24 },
            tooltip: { formatter: (p) => `${DIAS[p.value[1]]} às ${HORAS[p.value[0]]}: <b>${int(p.value[2])} pedidos</b>` },
            xAxis: { type: 'category', data: HORAS, axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: c.muted } },
            yAxis: { type: 'category', data: DIAS, inverse: true, axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: c.muted } },
            visualMap: { show: false, min: 0, max, inRange: { color: c.ramp } },
            series: [{ type: 'heatmap', data: dados, label: { show: true, fontSize: 11, color: c.text }, itemStyle: { borderColor: c.card, borderWidth: 2, borderRadius: 4 } }],
          }
        }}
      />
    </Card>
  )
}
