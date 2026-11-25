import { useMemo } from 'react'
import { ArrowDownToLine, ArrowUpFromLine, Boxes, ClipboardCheck, Layers, TrendingUp } from 'lucide-react'
import { useRecorte } from '../state/DashContext'
import { useTheme } from '../theme/ThemeProvider'
import { selecionar, serie, somaCampo } from '../data/metrics'
import { DAILY, DIAS, END, LOJAS, addDays } from '../data/daily'
import { conferencia, ROTULO } from '../data/estoque'
import { chavesMes, faturamentoMensal, previsaoPedidos } from '../data/previsao'
import { brl, brlCompacto, dataCurta, dec1, int, pct, sinal } from '../data/format'
import Card, { Pill, Status } from '../components/Card'
import KpiCard from '../components/KpiCard'
import DataTable from '../components/DataTable'
import DivergenciaCrescente from '../components/DivergenciaCrescente'
import Chart, { NOME_LOJA, eixoCat, eixoVal, grade, legenda, lojasVisiveis } from '../components/Chart'

export default function EstoquePrevisoes() {
  const { c } = useTheme()
  const { loja } = useRecorte()
  const vis = lojasVisiveis(loja)
  const confer = useMemo(() => conferencia(loja), [loja])
  const prev = useMemo(() => previsaoPedidos(14), [])
  const prev7 = prev.slice(0, 7)

  const contagem = { ok: 0, warn: 0, bad: 0 }
  confer.forEach((i) => (contagem[i.status] += 1))

  // últimas 3 semanas reais + 14 dias previstos
  const histIni = addDays(END, -20)
  const hist = DAILY.filter((r) => r.date >= histIni)
  const diasHist = [...new Set(hist.map((r) => r.date))]
  const real = diasHist.map((d) => vis.reduce((a, l) => a + (hist.find((r) => r.date === d && r.loja === l)?.pedidos || 0), 0))
  const futuro = prev.map((p) => vis.reduce((a, l) => a + p[l], 0))
  const labels = [...diasHist, ...prev.map((p) => p.date)].map(dataCurta)
  const dadosReal = [...real, ...Array(prev.length).fill(null)]
  const ultimoReal = real[real.length - 1]
  const dadosPrev = [...Array(real.length - 1).fill(null), ultimoReal, ...futuro]
  const banda = 0.08
  const baixo = dadosPrev.map((v, i) => (v == null || i < real.length ? null : Math.round(v * (1 - banda))))
  const faixa = dadosPrev.map((v, i) => (v == null || i < real.length ? null : Math.round(v * 2 * banda)))

  // entradas x saídas semanais (R$), derivadas do CMV
  const semanas = useMemo(() => {
    const out = []
    for (let s = 7; s >= 0; s--) {
      const fim = addDays(END, -7 * s)
      const ini = addDays(fim, -6)
      const g = DAILY.filter((r) => r.date >= ini && r.date <= fim && vis.includes(r.loja))
      const saida = g.reduce((a, r) => a + r.cmvValor, 0)
      const fator = 1 + Math.sin(s * 1.7) * 0.06 + 0.01
      out.push({ label: `${dataCurta(ini)}`, saida, entrada: saida * fator })
    }
    return out
  }, [vis.join()])

  const mens = useMemo(() => faturamentoMensal(loja), [loja])
  const mesLabels = chavesMes(18).map((m) => m.label)
  const fMensal = mens.itens

  const colunas = [
    { k: 'loja', rotulo: 'Loja', render: (l) => LOJAS[l.loja].nome, valor: (l) => l.loja },
    { k: 'nome', rotulo: 'Insumo' },
    { k: 'teorico', rotulo: 'Estoque teórico', align: 'right', render: (l) => `${int(l.teorico)} ${l.un}`, valor: (l) => l.teorico },
    { k: 'contado', rotulo: 'Contagem', align: 'right', render: (l) => `${int(l.contado)} ${l.un}`, valor: (l) => l.contado },
    { k: 'diff', rotulo: 'Diferença', align: 'right', render: (l) => sinal(l.diff), valor: (l) => Math.abs(l.diff) },
    {
      k: 'status',
      rotulo: 'Situação',
      render: (l) => (
        <span className="celula-status">
          <Status nivel={l.status}>{ROTULO[l.status]}</Status>
          {l.recorrente && <Pill tom="red">3 contagens seguidas</Pill>}
        </span>
      ),
      valor: (l) => Math.abs(l.diff),
    },
  ]

  return (
    <div className="secao">
      <div className="kpis">
        <KpiCard i={0} icone={TrendingUp} rotulo="Pedidos previstos (7 dias)" valor={prev7.reduce((a, p) => a + vis.reduce((x, l) => x + p[l], 0), 0)} formato={int} nota="média das últimas 8 semanas" />
        <KpiCard i={1} icone={Layers} rotulo="Massas necessárias (7 dias)" valor={prev7.reduce((a, p) => a + vis.reduce((x, l) => x + (l === 'h' ? p.massasH : p.massasR), 0), 0)} formato={int} nota="com 5% de margem" />
        <KpiCard i={2} icone={ClipboardCheck} rotulo="Insumos conferidos" valor={confer.length} formato={int} status={contagem.bad ? { nivel: 'bad', texto: `${contagem.bad} para investigar` } : contagem.warn ? { nivel: 'warn', texto: `${contagem.warn} com atenção` } : { nivel: 'ok', texto: 'Tudo certo' }} />
        <KpiCard i={3} icone={Boxes} rotulo="Previsão de faturamento (próx. 6 meses)" valor={fMensal.slice(12).reduce((a, m) => a + m.valor, 0)} formato={brlCompacto} nota={`crescimento de ${pct(mens.yoy)} sobre o ano anterior`} />
      </div>

      <div className="grade g-2">
        <Card i={1} title="Pedidos: real e previsto" sub="Faixa de ±8% ao redor da previsão. É uma projeção simples, não um modelo estatístico.">
          <Chart
            label="Linha de pedidos reais das últimas três semanas e previsão para 14 dias com faixa de incerteza"
            height={300}
            build={() => ({
              grid: grade(),
              legend: legenda(c, { data: ['Real', 'Previsto'] }),
              tooltip: { trigger: 'axis', valueFormatter: (v) => (v == null ? '-' : int(v)) },
              xAxis: eixoCat(c, labels, { boundaryGap: false, axisLabel: { color: c.muted, fontSize: 12, hideOverlap: true } }),
              yAxis: eixoVal(c, (v) => int(v), { scale: true }),
              series: [
                { name: 'faixa-base', type: 'line', data: baixo, stack: 'banda', symbol: 'none', lineStyle: { opacity: 0 }, tooltip: { show: false }, silent: true },
                { name: 'faixa', type: 'line', data: faixa, stack: 'banda', symbol: 'none', lineStyle: { opacity: 0 }, areaStyle: { color: c.primary, opacity: 0.14 }, tooltip: { show: false }, silent: true },
                { name: 'Real', type: 'line', data: dadosReal, smooth: 0.3, showSymbol: false, lineStyle: { width: 3, color: c.h }, itemStyle: { color: c.h } },
                { name: 'Previsto', type: 'line', data: dadosPrev, smooth: 0.3, showSymbol: false, lineStyle: { width: 3, color: c.primary, type: 'dashed' }, itemStyle: { color: c.primary } },
              ],
            })}
          />
        </Card>
        <Card i={2} title="Massas para os próximos 7 dias" sub="Pizzas previstas por pedido: 1,45, com margem de 5%">
          <Chart
            label="Barras empilhadas de massas necessárias por dia nos próximos sete dias"
            height={300}
            build={() => ({
              grid: grade(),
              legend: legenda(c),
              tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, valueFormatter: (v) => `${int(v)} massas` },
              xAxis: eixoCat(c, prev7.map((p) => `${DIAS[p.dow]} ${dataCurta(p.date)}`), { axisLabel: { color: c.muted, fontSize: 11 } }),
              yAxis: eixoVal(c, (v) => int(v)),
              series: vis.map((l) => ({
                name: NOME_LOJA[l],
                type: 'bar',
                stack: 'massas',
                barMaxWidth: 28,
                data: prev7.map((p) => (l === 'h' ? p.massasH : p.massasR)),
                itemStyle: { color: l === 'h' ? c.h : c.r, borderColor: c.card, borderWidth: 1 },
              })),
            })}
          />
        </Card>
      </div>

      <div className="grade g-2e">
        <Card i={3} title="Entrada e saída de insumos" sub="Compras e consumo por semana, em reais (consumo = custo das mercadorias vendidas)">
          <Chart
            label="Barras de entrada e saída de insumos por semana"
            height={280}
            build={() => ({
              grid: grade(),
              legend: legenda(c),
              tooltip: { trigger: 'axis', valueFormatter: (v) => brl(v) },
              xAxis: eixoCat(c, semanas.map((s) => `Sem. ${s.label}`), { axisLabel: { color: c.muted, fontSize: 11, hideOverlap: true } }),
              yAxis: eixoVal(c, (v) => brlCompacto(v)),
              series: [
                { name: 'Entrada (compras)', type: 'bar', barMaxWidth: 20, data: semanas.map((s) => Math.round(s.entrada)), itemStyle: { color: c.r, borderRadius: [5, 5, 0, 0] } },
                { name: 'Saída (consumo)', type: 'bar', barMaxWidth: 20, data: semanas.map((s) => Math.round(s.saida)), itemStyle: { color: c.h, borderRadius: [5, 5, 0, 0] } },
              ],
            })}
          />
        </Card>
        <Card i={4} title="Faturamento: 12 meses e previsão" sub={`Barras claras são previsão (próximos 6 meses). Crescimento sobre o ano anterior: ${pct(mens.yoy)}`}>
          <Chart
            label="Barras do faturamento mensal real e previsto para os próximos seis meses"
            height={280}
            build={() => ({
              grid: grade(),
              tooltip: { trigger: 'axis', valueFormatter: (v) => brl(v) },
              xAxis: eixoCat(c, mesLabels, { axisLabel: { color: c.muted, fontSize: 11, hideOverlap: true } }),
              yAxis: eixoVal(c, (v) => brlCompacto(v)),
              series: [
                {
                  type: 'bar',
                  barMaxWidth: 20,
                  data: fMensal.map((m) => ({ value: Math.round(m.valor), itemStyle: { color: m.futuro ? c.primary : c.h, opacity: m.futuro ? 0.45 : 1, borderRadius: [5, 5, 0, 0], borderColor: c.primary, borderWidth: m.futuro ? 1.5 : 0, borderType: 'dashed' } })),
                },
              ],
            })}
          />
        </Card>
      </div>

      <DivergenciaCrescente loja={loja} i={5} />

      <Card
        i={6}
        title="Conferência de estoque"
        sub="Contagem física contra o estoque teórico. Divergência acima de 5% pede investigação, não é acusação."
        right={
          <span className="chips-status">
            <Status nivel="ok">{contagem.ok}</Status>
            <Status nivel="warn">{contagem.warn}</Status>
            <Status nivel="bad">{contagem.bad}</Status>
          </span>
        }
        flush
      >
        <DataTable colunas={colunas} linhas={confer} chave={(l) => `${l.loja}-${l.nome}`} maxAltura={420} inicial={{ k: 'diff', dir: 'desc' }} />
      </Card>
      <p className="nota-fim">
        <ArrowDownToLine size={14} aria-hidden="true" /> Entradas e <ArrowUpFromLine size={14} aria-hidden="true" /> saídas são simuladas. Na versão real, viriam das planilhas ou das APIs do sistema.
      </p>
    </div>
  )
}
