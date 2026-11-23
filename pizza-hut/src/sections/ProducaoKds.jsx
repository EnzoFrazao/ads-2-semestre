import { AlertTriangle, ChefHat, Flame, PackageCheck, Pizza, Radio, Timer, Truck } from 'lucide-react'
import { useDash } from '../state/DashContext'
import { useTheme } from '../theme/ThemeProvider'
import { DIAS, LOJAS, META_ENTREGA } from '../data/daily'
import { PERIODOS, mediaPond, selecionar, serie, variacao } from '../data/metrics'
import { ETAPAS, etapaPorDia, maiorGargalo, mediaEtapas, nivelDespacho, nivelEtapa, ocorrencias } from '../data/kds'
import { dataCurta, dec1, min } from '../data/format'
import Card, { Pill, Status } from '../components/Card'
import KpiCard from '../components/KpiCard'
import Chart, { eixoCat, eixoVal, grade, legenda } from '../components/Chart'

const ICONES = { montagem: Pizza, forno: Flame, porta: PackageCheck, despacho: Truck }
const ROTULO_NIVEL = { ok: 'Na meta', warn: 'Acima da meta', bad: 'Muito acima' }

export default function ProducaoKds() {
  const { c } = useTheme()
  const { loja, periodo } = useDash()
  const label = PERIODOS[periodo].label

  // O KDS só existe nos Holandeses: os dados desta aba são sempre de lá, qualquer que seja o filtro de loja.
  const rows = selecionar('h', periodo)
  const antes = selecionar('h', periodo, 1)
  const med = mediaEtapas(rows)
  const medAntes = mediaEtapas(antes)
  const gargalo = maiorGargalo(med)
  const eventos = ocorrencias('h', 28)
  // O mapa de calor ignora os dias fora do padrão (equipamento): eles escondem o comportamento normal de cada dia.
  const foraPadrao = new Set(ocorrencias('h', 400).flatMap((o) => o.linhas.map((l) => l.date)))
  const porDia = etapaPorDia(rows.filter((r) => !foraPadrao.has(r.date)))
  const trend = ETAPAS.map((e) => serie(rows, mediaPond(e.id), periodo))
  const labels = trend[0].labels

  return (
    <div className="secao">
      <div className="banner banner-info">
        <Radio size={18} aria-hidden="true" />
        <span>
          O KDS registra o &ldquo;ok&rdquo; de cada etapa, então o painel mostra <strong>onde o pedido esperou</strong>. A análise é por <strong>etapa e dia, não por pessoa</strong>.{' '}
          {loja === 'r' ? (
            <>
              A <strong>Renascença ainda não tem KDS</strong> (compra solicitada). Esta aba mostra os Holandeses.
            </>
          ) : (
            <>
              Hoje só os <strong>Holandeses</strong> têm o sistema; a Renascença entra quando o KDS for instalado.
            </>
          )}
        </span>
      </div>

      <div className="kpis">
        <KpiCard
          i={0}
          icone={Timer}
          rotulo="Pedido até despacho"
          valor={med.total}
          formato={(v) => min(v)}
          delta={variacao(med.total, medAntes.total)}
          inverso
          status={{ nivel: nivelDespacho(med.total), texto: ROTULO_NIVEL[nivelDespacho(med.total)] }}
          nota={`meta de ${META_ENTREGA} min`}
        />
        {ETAPAS.map((e, idx) => {
          const n = nivelEtapa(med[e.id], e.meta)
          return (
            <KpiCard
              key={e.id}
              i={idx + 1}
              icone={ICONES[e.id]}
              rotulo={e.nome}
              valor={med[e.id]}
              formato={(v) => `${dec1(v)} min`}
              delta={variacao(med[e.id], medAntes[e.id])}
              inverso
              status={{ nivel: n, texto: ROTULO_NIVEL[n] }}
              nota={`meta de ${dec1(e.meta)} min`}
            />
          )
        })}
      </div>

      <div className="grade g-2e">
        <Card i={1} title="Onde o tempo se perde" sub={`Média dos últimos ${label} contra a meta de cada etapa, em minutos`}>
          <Chart
            label="Barras do tempo médio de cada etapa contra a meta"
            height={290}
            build={() => ({
              grid: grade(),
              legend: legenda(c),
              tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, valueFormatter: (v) => `${dec1(v)} min` },
              xAxis: eixoCat(c, ETAPAS.map((e) => e.nome), { axisLabel: { color: c.muted, fontSize: 11, interval: 0 } }),
              yAxis: eixoVal(c, (v) => `${v}`, { min: 0 }),
              series: [
                {
                  name: 'Meta',
                  type: 'bar',
                  barMaxWidth: 26,
                  data: ETAPAS.map((e) => Number(e.meta.toFixed(1))),
                  itemStyle: { color: c.grid, borderColor: c.muted, borderWidth: 1, borderRadius: [5, 5, 0, 0] },
                },
                {
                  name: 'Realizado',
                  type: 'bar',
                  barMaxWidth: 26,
                  itemStyle: { color: c.primary },
                  label: { show: true, position: 'top', color: c.text, fontSize: 12, formatter: (p) => dec1(p.value) },
                  data: ETAPAS.map((e) => ({
                    value: Number(med[e.id].toFixed(2)),
                    itemStyle: { color: { ok: c.ok, warn: c.warn, bad: c.bad }[nivelEtapa(med[e.id], e.meta)], borderRadius: [5, 5, 0, 0] },
                  })),
                },
              ],
            })}
          />
        </Card>

        <Card i={2} title="Tempo por etapa ao longo do tempo" sub={periodo === '12m' ? 'Semanal, empilhado' : 'Diário, empilhado. A soma é o tempo até o despacho'}>
          <Chart
            label="Área empilhada do tempo de cada etapa até o despacho"
            height={290}
            build={() => ({
              grid: grade(),
              legend: legenda(c),
              tooltip: { trigger: 'axis', valueFormatter: (v) => (v == null ? '-' : `${dec1(v)} min`) },
              xAxis: eixoCat(c, labels, { boundaryGap: false, axisLabel: { color: c.muted, fontSize: 12, hideOverlap: true } }),
              yAxis: eixoVal(c, (v) => `${v}`, { min: 0 }),
              series: ETAPAS.map((e, idx) => ({
                name: e.nome,
                type: 'line',
                stack: 'total',
                smooth: 0.25,
                showSymbol: false,
                lineStyle: { width: 1.5, color: c.series[idx] },
                itemStyle: { color: c.series[idx] },
                areaStyle: { color: c.series[idx], opacity: 0.55 },
                data: trend[idx].h.map((v) => (v == null ? null : Number(v.toFixed(2)))),
                ...(idx === ETAPAS.length - 1
                  ? { markLine: { symbol: 'none', silent: true, lineStyle: { color: c.bad, type: 'dashed', width: 1.5 }, label: { color: c.bad, formatter: `Meta ${META_ENTREGA} min`, position: 'insideEndTop' }, data: [{ yAxis: META_ENTREGA }] } }
                  : {}),
              })),
            })}
          />
        </Card>
      </div>

      <div className="grade g-2e">
        <Card i={3} title="Quando cada etapa passa da meta" sub="Minutos acima (+) ou abaixo (−) da meta, por dia da semana, sem os dias fora do padrão">
          <Chart
            label="Mapa de calor do excesso de tempo por etapa e dia da semana"
            height={250}
            build={() => {
              const dados = []
              porDia.forEach((linha, y) => linha.forEach((v, x) => dados.push({ value: [x, y, v == null ? null : Number((v - ETAPAS[y].meta).toFixed(1))], real: v })))
              return {
                grid: { left: 92, right: 6, top: 4, bottom: 22 },
                tooltip: { formatter: (p) => `${ETAPAS[p.value[1]].nome}, ${DIAS[p.value[0]]}: <b>${dec1(p.data.real)} min</b> (meta ${dec1(ETAPAS[p.value[1]].meta)})` },
                xAxis: { type: 'category', data: DIAS, splitArea: { show: false }, axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: c.muted } },
                yAxis: { type: 'category', data: ETAPAS.map((e) => e.nome), inverse: true, axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: c.muted } },
                visualMap: { show: false, min: -0.5, max: 3, inRange: { color: c.ramp } },
                series: [
                  {
                    type: 'heatmap',
                    data: dados,
                    label: { show: true, fontSize: 11, formatter: (p) => (Math.abs(p.value[2]) < 0.05 ? '0,0' : p.value[2] > 0 ? `+${dec1(p.value[2])}` : dec1(p.value[2])), color: c.text },
                    itemStyle: { borderColor: c.card, borderWidth: 2, borderRadius: 4 },
                  },
                ],
              }
            }}
          />
        </Card>

        <Card
          i={4}
          title="Leitura do gargalo"
          sub={`Janela de ${label}`}
          right={<Pill tom="gray">{LOJAS.h.nome}</Pill>}
        >
          <ul className="leitura">
            <li>
              <strong>{gargalo.nome}</strong> é a etapa que mais passa da meta: {dec1(gargalo.valor)} min para {dec1(gargalo.meta)} min ({gargalo.excesso > 0 ? '+' : ''}
              {dec1(gargalo.excesso)}).
            </li>
            <li>
              O <strong>forno</strong> é praticamente fixo (~7 min). O ganho vem de montagem, corte e despacho, que absorvem os picos de sexta a domingo.
            </li>
            <li>
              Para ir de {dec1(med.total)} para {META_ENTREGA} min, faltam <strong>{dec1(Math.max(0, med.total - META_ENTREGA))} min</strong> a reduzir.
            </li>
          </ul>
        </Card>
      </div>

      <Card i={5} title="Dias fora do padrão" sub="Tempo muito acima do normal da loja nas últimas 4 semanas" right={eventos.length ? <Status nivel="warn">{eventos.length} ocorrência{eventos.length > 1 ? 's' : ''}</Status> : <Status nivel="ok">Nenhuma</Status>}>
        {eventos.length === 0 ? (
          <p className="muted">Nenhum dia saiu do padrão nas últimas 4 semanas.</p>
        ) : (
          <ul className="historico">
            {eventos.map((e) => (
              <li key={e.ini}>
                <AlertTriangle size={20} aria-hidden="true" className="ic-warn" />
                <span className="hist-info">
                  <strong>
                    {e.dias === 1 ? dataCurta(e.ini) : `${dataCurta(e.ini)} a ${dataCurta(e.fim)}`}: pico de {Math.round(e.pico)} min
                  </strong>
                  <span>
                    Normal da loja: {Math.round(e.normal)} min. O maior tempo estava em {e.etapa.toLowerCase()}. Antes de cobrar a equipe, confira monitor, cabo e rede do KDS.
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
        <p className="muted nota-freq">
          <ChefHat size={14} aria-hidden="true" /> Já aconteceu na operação: o tempo foi a 56 min por um cabo solto no monitor e voltou a 35 min depois do reparo.
        </p>
      </Card>
    </div>
  )
}
