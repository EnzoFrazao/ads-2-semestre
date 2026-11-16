import { useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import * as echarts from 'echarts/core'
import { BarChart, GaugeChart, HeatmapChart, LineChart, PieChart, RadarChart, TreemapChart } from 'echarts/charts'
import {
  GridComponent,
  LegendComponent,
  MarkAreaComponent,
  MarkLineComponent,
  RadarComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import ReactEChartsCore from 'echarts-for-react/lib/core'
import { useTheme } from '../theme/ThemeProvider'

echarts.use([
  BarChart,
  GaugeChart,
  HeatmapChart,
  LineChart,
  PieChart,
  RadarChart,
  TreemapChart,
  GridComponent,
  LegendComponent,
  MarkAreaComponent,
  MarkLineComponent,
  RadarComponent,
  TooltipComponent,
  VisualMapComponent,
  CanvasRenderer,
])

function montar(o, c, reduzir) {
  return {
    backgroundColor: 'transparent',
    textStyle: { fontFamily: "'Source Sans 3', system-ui, sans-serif", color: c.muted },
    animation: !reduzir,
    animationDuration: 1100,
    animationEasing: 'cubicOut',
    animationDelay: (i) => i * 12,
    animationDurationUpdate: 600,
    ...o,
    tooltip: {
      backgroundColor: c.card,
      borderColor: c.border,
      borderWidth: 1,
      textStyle: { color: c.text, fontSize: 13 },
      extraCssText: 'border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.2);',
      confine: true,
      ...(o.tooltip || {}),
    },
  }
}

// `build(c)` recebe a paleta do tema atual e devolve as opções do ECharts. As opções só são
// recriadas (e a animação de entrada só repete) quando o conteúdo ou o tema realmente mudam.
export default function Chart({ build, height = 260, onEvents, className = '', label }) {
  const { c, theme } = useTheme()
  const reduzir = useReducedMotion()
  const cache = useRef({ chave: null, option: null })

  const bruto = build(c)
  const chave = `${theme}|${reduzir}|${JSON.stringify(bruto)}`
  if (cache.current.chave !== chave) cache.current = { chave, option: montar(bruto, c, reduzir) }

  return (
    <div className={className} role="img" aria-label={label}>
      <ReactEChartsCore echarts={echarts} option={cache.current.option} notMerge lazyUpdate style={{ height, width: '100%' }} onEvents={onEvents} />
    </div>
  )
}

// ---- peças reutilizáveis de eixo, grade e legenda ----
export const NOME_LOJA = { h: 'Holandeses', r: 'Renascença' }
export const corLoja = (c, l) => (l === 'h' ? c.h : c.r)
export const lojasVisiveis = (loja) => (loja === 'all' ? ['h', 'r'] : [loja])

export const grade = (extra = {}) => ({ left: 8, right: 12, top: 32, bottom: 4, containLabel: true, ...extra })

export const eixoCat = (c, data, extra = {}) => ({
  type: 'category',
  data,
  axisLine: { lineStyle: { color: c.border } },
  axisTick: { show: false },
  axisLabel: { color: c.muted, fontSize: 12 },
  ...extra,
})

export const eixoVal = (c, fmt, extra = {}) => ({
  type: 'value',
  axisLine: { show: false },
  axisTick: { show: false },
  axisLabel: { color: c.muted, fontSize: 12, formatter: fmt },
  splitLine: { lineStyle: { color: c.grid } },
  ...extra,
})

export const legenda = (c, extra = {}) => ({
  top: 0,
  right: 0,
  itemWidth: 10,
  itemHeight: 10,
  icon: 'roundRect',
  textStyle: { color: c.muted, fontSize: 12 },
  ...extra,
})

// Linha por loja: Holandeses sólida e Renascença tracejada (não depende só da cor)
export const serieLinha = (c, l, data, extra = {}) => ({
  name: NOME_LOJA[l],
  type: 'line',
  data,
  smooth: 0.3,
  showSymbol: false,
  connectNulls: true,
  lineStyle: { width: 2.5, color: corLoja(c, l), type: l === 'r' ? 'dashed' : 'solid' },
  itemStyle: { color: corLoja(c, l) },
  areaStyle: { color: corLoja(c, l), opacity: 0.08 },
  emphasis: { focus: 'series' },
  ...extra,
})

export const serieBarra = (c, l, data, extra = {}) => ({
  name: NOME_LOJA[l],
  type: 'bar',
  data,
  barMaxWidth: 22,
  itemStyle: { color: corLoja(c, l), borderRadius: [5, 5, 0, 0] },
  emphasis: { focus: 'series' },
  ...extra,
})
