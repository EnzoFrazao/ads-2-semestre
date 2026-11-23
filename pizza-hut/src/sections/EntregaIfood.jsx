import { motion } from 'framer-motion'
import { Award, Bike, Clock3, Hourglass, MapPinned, Timer, TriangleAlert } from 'lucide-react'
import { useRecorte } from '../state/DashContext'
import { useTheme } from '../theme/ThemeProvider'
import { mediaPond, serie, variacao } from '../data/metrics'
import { DAILY, DIAS, HORAS, META_ENTREGA, MIN_MOTOBOYS, mapaTempo } from '../data/daily'
import { SELO, avaliarSelo, nivelSuper } from '../data/alertas'
import { dataCurta, dec1, dec2, min, pct } from '../data/format'
import { nivelDespacho } from '../data/kds'
import Card, { Status } from '../components/Card'
import KpiCard from '../components/KpiCard'
import Chart, { eixoCat, eixoVal, grade, legenda, lojasVisiveis, serieLinha } from '../components/Chart'

const limitar = (v) => Math.min(1, Math.max(0, v))

function SuperMeter({ rotulo, valor, limite, tipo, fmt, escala, aviso, i }) {
  const [a, b] = escala
  const pos = (v) => `${limitar((v - a) / (b - a)) * 100}%`
  const nivel = nivelSuper(valor, limite, tipo, aviso)
  return (
    <div className="super-meter">
      <div className="super-topo">
        <span>{rotulo}</span>
        <Status nivel={nivel}>{nivel === 'ok' ? 'Dentro' : nivel === 'warn' ? 'Perto do limite' : 'Fora do limite'}</Status>
      </div>
      <div className="super-valor">{fmt(valor)}</div>
      <div className="super-trilho">
        <motion.span className={`super-fill fill-${nivel}`} initial={{ width: 0 }} animate={{ width: pos(valor) }} transition={{ delay: 0.3 + i * 0.15, duration: 1, ease: [0.2, 0.7, 0.2, 1] }} />
        <span className="super-limite" style={{ left: pos(limite) }} />
      </div>
      <div className="super-leg">
        {tipo === 'min' ? 'Mínimo' : 'Máximo'} do selo: {fmt(limite)}
      </div>
      <span className="sr-only">{nivel}</span>
    </div>
  )
}

function medidor(c, { valor, min: mn, max: mx, faixas, fmt }) {
  return {
    series: [
      {
        type: 'gauge',
        min: mn,
        max: mx,
        startAngle: 200,
        endAngle: -20,
        radius: '95%',
        center: ['50%', '64%'],
        axisLine: { lineStyle: { width: 14, color: faixas } },
        pointer: { length: '62%', width: 5, itemStyle: { color: c.text } },
        anchor: { show: true, size: 10, itemStyle: { color: c.text } },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        title: { show: false },
        detail: { valueAnimation: true, formatter: fmt, offsetCenter: [0, '42%'], fontSize: 26, fontFamily: 'Lilita One', color: c.text },
        data: [{ value: valor }],
      },
    ],
  }
}

export default function EntregaIfood() {
  const { c } = useTheme()
  const { loja, periodo, label, rows, atual, anterior } = useRecorte()
  const vis = lojasVisiveis(loja)
  const lojaMapa = loja === 'h' ? 'h' : 'r'
  const mapa = mapaTempo(lojaMapa)

  const tempoSerie = serie(rows, mediaPond('tempo'), periodo)

  // sexta a domingo da Renascença nas últimas 8 semanas
  const pico = DAILY.filter((r) => r.loja === 'r' && r.dow >= 4).slice(-24)
  const mediaMoto = pico.slice(-12).reduce((a, r) => a + r.motoboys, 0) / 12
  const diasAbaixo = pico.filter((r) => r.motoboys < MIN_MOTOBOYS).length

  const notaSerie = serie(rows, mediaPond('nota'), periodo)

  const niveis = Object.values(avaliarSelo(atual))
  const statusSelo = niveis.includes('bad') ? 'bad' : niveis.includes('warn') ? 'warn' : 'ok'
  const rotuloSelo = { ok: 'Dentro dos três limites', warn: 'Dentro dos limites, com pouca folga', bad: 'Em risco' }[statusSelo]

  return (
    <div className="secao">
      <div className="banner banner-warn">
        <TriangleAlert size={18} aria-hidden="true" />
        <span>
          Os dados do iFood vêm do Toqan com <strong>até 48 horas de defasagem</strong>. Os números dos dois últimos dias podem mudar.
        </span>
      </div>

      <div className="banner banner-info">
        <MapPinned size={18} aria-hidden="true" />
        <span>
          O tempo desta aba é do <strong>pedido cair na central até o motoboy sair</strong> (meta de {META_ENTREGA} min). O tempo <strong>até o cliente</strong> só existe para o motoboy do iFood ({pct(atual.coberturaCliente, 0)} dos pedidos); a cooperativa não informa o que acontece depois que sai da loja.
        </span>
      </div>

      <div className="kpis">
        <KpiCard i={0} icone={Timer} rotulo="Pedido até despacho" valor={atual.tempo} formato={(v) => min(v)} delta={variacao(atual.tempo, anterior.tempo)} inverso status={{ nivel: nivelDespacho(atual.tempo), texto: nivelDespacho(atual.tempo) === 'ok' ? 'Na meta' : 'Acima da meta' }} nota={`meta de ${META_ENTREGA} min`} />
        <KpiCard i={1} icone={Clock3} rotulo="Mediana dos dias" valor={atual.tempoMediana} formato={(v) => min(v)} nota="dia típico, sem picos" />
        <KpiCard i={2} icone={Award} rotulo="Dentro da meta" valor={atual.dentro} formato={(v) => pct(v, 0)} delta={variacao(atual.dentro, anterior.dentro)} nota={`despachados em até ${META_ENTREGA} min`} />
        <KpiCard i={3} icone={Hourglass} rotulo="Acima da meta" valor={atual.atrasos} formato={(v) => pct(v, 0)} delta={variacao(atual.atrasos, anterior.atrasos)} inverso nota={`nos últimos ${label}`} />
        <KpiCard i={4} icone={MapPinned} rotulo="Com tempo até o cliente" valor={atual.coberturaCliente} formato={(v) => pct(v, 0)} nota="só motoboy iFood" />
        <KpiCard i={5} icone={Bike} rotulo="Motoboys (sex a dom)" valor={mediaMoto} formato={(v) => dec1(v)} status={diasAbaixo ? { nivel: diasAbaixo >= 3 ? 'bad' : 'warn', texto: `${diasAbaixo} dias abaixo de ${MIN_MOTOBOYS}` } : { nivel: 'ok', texto: 'Escala completa' }} nota="Renascença, 4 semanas" />
      </div>

      <div className="grade g-3">
        <Card i={1} title="Pedido até despacho" sub={`Meta de ${META_ENTREGA} min`}>
          <Chart
            label={`Medidor do tempo até o despacho: ${min(atual.tempo)}`}
            height={210}
            build={() => medidor(c, { valor: Number(atual.tempo.toFixed(1)), min: 10, max: 30, faixas: [[0.25, c.ok], [0.5, c.warn], [1, c.bad]], fmt: (v) => `${Math.round(v)} min` })}
          />
        </Card>
        <Card i={2} title="Dentro da meta" sub={`Pedidos despachados em até ${META_ENTREGA} min`}>
          <Chart
            label={`Medidor de pedidos dentro da meta: ${pct(atual.dentro, 0)}`}
            height={210}
            build={() => medidor(c, { valor: Number(atual.dentro.toFixed(1)), min: 0, max: 100, faixas: [[0.4, c.bad], [0.7, c.warn], [1, c.ok]], fmt: (v) => `${Math.round(v)}%` })}
          />
        </Card>
        <Card i={3} title="Despacho por dia e horário" sub={`${lojaMapa === 'r' ? 'Renascença' : 'Holandeses'}, média de 90 dias, em minutos`}>
          <Chart
            label="Mapa de calor do tempo de entrega por dia da semana e horário"
            height={210}
            build={() => {
              const dados = []
              mapa.forEach((linha, y) => linha.forEach((v, x) => dados.push({ value: [x, y, v], label: { color: v >= 26 ? '#fff' : c.text } })))
              return {
                grid: { left: 36, right: 6, top: 4, bottom: 22 },
                tooltip: { formatter: (p) => `${DIAS[p.value[1]]} às ${HORAS[p.value[0]]}: <b>${p.value[2]} min</b>` },
                xAxis: { type: 'category', data: HORAS, splitArea: { show: false }, axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: c.muted } },
                yAxis: { type: 'category', data: DIAS, inverse: true, axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: c.muted } },
                visualMap: { show: false, min: 14, max: 34, inRange: { color: c.ramp } },
                series: [{ type: 'heatmap', data: dados, label: { show: true, fontSize: 11 }, itemStyle: { borderColor: c.card, borderWidth: 2, borderRadius: 4 } }],
              }
            }}
          />
        </Card>
      </div>

      <div className="grade g-2e">
        <Card i={4} title="Pedido até despacho" sub="Linha tracejada vermelha: meta">
          <Chart
            label="Linha do tempo até o despacho por loja com a meta de 15 minutos"
            height={270}
            build={() => ({
              grid: grade(),
              legend: legenda(c),
              tooltip: { trigger: 'axis', valueFormatter: (v) => (v == null ? '-' : min(v)) },
              xAxis: eixoCat(c, tempoSerie.labels, { boundaryGap: false, axisLabel: { color: c.muted, fontSize: 12, hideOverlap: true } }),
              yAxis: eixoVal(c, (v) => `${v}`, { min: 10 }),
              series: vis.map((l, idx) =>
                serieLinha(c, l, tempoSerie[l].map((v) => (v == null ? null : Number(v.toFixed(1)))), {
                  areaStyle: undefined,
                  ...(idx === 0 ? { markLine: { symbol: 'none', silent: true, lineStyle: { color: c.bad, type: 'dashed', width: 1.5 }, label: { color: c.bad, formatter: `Meta ${META_ENTREGA} min`, position: 'insideEndTop' }, data: [{ yAxis: META_ENTREGA }] } } : {}),
                }),
              ),
            })}
          />
        </Card>
        <Card i={5} title="Motoboys escalados" sub={`Renascença, sexta a domingo, mínimo de ${MIN_MOTOBOYS}`}>
          <Chart
            label="Barras de motoboys escalados nos dias de pico com o mínimo de 10"
            height={270}
            build={() => ({
              grid: grade(),
              tooltip: { trigger: 'axis', valueFormatter: (v) => `${v} motoboys` },
              xAxis: eixoCat(c, pico.map((r) => `${DIAS[r.dow]} ${dataCurta(r.date)}`), { axisLabel: { color: c.muted, fontSize: 11, interval: 2, rotate: 0, hideOverlap: true } }),
              yAxis: eixoVal(c, (v) => `${v}`, { min: 0, max: 14, interval: 2 }),
              series: [
                {
                  type: 'bar',
                  barMaxWidth: 16,
                  data: pico.map((r) => ({ value: r.motoboys, itemStyle: { color: r.motoboys < MIN_MOTOBOYS ? (r.motoboys <= MIN_MOTOBOYS - 2 ? c.bad : c.warn) : c.r, borderRadius: [4, 4, 0, 0] } })),
                  markLine: { symbol: 'none', silent: true, lineStyle: { color: c.bad, type: 'dashed', width: 1.5 }, label: { color: c.bad, formatter: `Mínimo ${MIN_MOTOBOYS}`, position: 'insideStartTop' }, data: [{ yAxis: MIN_MOTOBOYS }] },
                },
              ],
            })}
          />
        </Card>
      </div>

      <Card
        i={6}
        title="Selo SUPER do iFood"
        sub={`Indicadores dos últimos ${label}. O painel oficial do iFood é a referência final.`}
        right={<Status nivel={statusSelo}>{rotuloSelo}</Status>}
      >
        <div className="grade g-super">
          <div className="super-lista">
            <SuperMeter i={0} {...SELO.nota} rotulo="Nota média" valor={atual.nota} escala={[4.2, 5]} />
            <SuperMeter i={1} {...SELO.cancel} rotulo="Taxa de cancelamento" valor={atual.cancel} escala={[0, 1.5]} />
            <SuperMeter i={2} {...SELO.acordo} rotulo="Taxa de acordo" valor={atual.acordo} escala={[0, 3.5]} />
          </div>
          <Chart
            label="Linha da nota média do iFood com o mínimo de 4,7"
            height={250}
            build={() => ({
              grid: grade(),
              legend: legenda(c),
              tooltip: { trigger: 'axis', valueFormatter: (v) => (v == null ? '-' : dec2(v)) },
              xAxis: eixoCat(c, notaSerie.labels, { boundaryGap: false, axisLabel: { color: c.muted, fontSize: 12, hideOverlap: true } }),
              yAxis: eixoVal(c, (v) => dec1(v), { min: 4.5, max: 5 }),
              series: vis.map((l, idx) =>
                serieLinha(c, l, notaSerie[l].map((v) => (v == null ? null : Number(v.toFixed(3)))), {
                  areaStyle: undefined,
                  ...(idx === 0 ? { markLine: { symbol: 'none', silent: true, lineStyle: { color: c.warn, type: 'dashed', width: 1.5 }, label: { color: c.muted, formatter: 'Mínimo 4,7', position: 'insideEndBottom' }, data: [{ yAxis: 4.7 }] } } : {}),
                }),
              ),
            })}
          />
        </div>
      </Card>
    </div>
  )
}
