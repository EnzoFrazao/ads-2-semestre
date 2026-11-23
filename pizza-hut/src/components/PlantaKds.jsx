import { useId } from 'react'
import { META_ENTREGA } from '../data/daily'
import { ETAPAS, maiorGargalo, nivelDespacho, nivelEtapa } from '../data/kds'
import { dec1 } from '../data/format'

// Planta ilustrativa da cozinha vista de cima: o pedido entra no tablet, passa pela montagem, pelo forno,
// pela porta (corte e caixa) e pelo delivery, e sai na garupa do motoboy. Não tem medidas reais: o que
// vale é a ordem do fluxo e o tempo de cada estação, que vêm do KDS (ver data/kds.js).

const W = 1150
const H_SVG = 470
const Y = 120 // topo das estações
const H = 180 // altura das estações
const CY = Y + H / 2

// Posição de cada estação (x, largura). O centro delas é por onde a pizza passa.
const EST = {
  montagem: { x: 140, w: 200 },
  forno: { x: 365, w: 310 },
  porta: { x: 700, w: 130 },
  despacho: { x: 855, w: 140 },
}
const X_ENTRADA = 73
const X_SAIDA = 1072
const centro = (id) => EST[id].x + EST[id].w / 2
const PARADAS = [X_ENTRADA, ...ETAPAS.map((e) => centro(e.id)), X_SAIDA]
const TRILHA = `M${PARADAS[0]} ${CY} ${PARADAS.slice(1)
  .map((x) => `L${x} ${CY}`)
  .join(' ')}`
const COMPRIMENTO = X_SAIDA - X_ENTRADA

const CICLO_S = 16
const FRACAO_VIAGEM = 0.22

// Roteiro da pizza: anda entre as estações e fica parada em cada uma na proporção do tempo dela.
function roteiro(med) {
  const tempos = ETAPAS.map((e) => Math.max(med[e.id], 0.05))
  const soma = tempos.reduce((a, b) => a + b, 0)
  const kt = [0]
  const kp = [0]
  let t = 0
  PARADAS.slice(1).forEach((x, i) => {
    t += (FRACAO_VIAGEM * (x - PARADAS[i])) / COMPRIMENTO
    kt.push(t)
    kp.push((x - X_ENTRADA) / COMPRIMENTO)
    if (i < ETAPAS.length) {
      t += ((1 - FRACAO_VIAGEM) * tempos[i]) / soma
      kt.push(t)
      kp.push((x - X_ENTRADA) / COMPRIMENTO)
    }
  })
  kt[kt.length - 1] = 1
  const f = (n) => Number(n.toFixed(4))
  return { keyTimes: kt.map(f).join(';'), keyPoints: kp.map(f).join(';') }
}

const PEPERONI = [
  [-0.38, -0.3],
  [0.36, -0.22],
  [-0.1, 0.42],
  [0.32, 0.36],
  [-0.46, 0.18],
]

function Pizza({ cx = 0, cy = 0, r = 20, cortes = false }) {
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <circle r={r + 1.5} fill="#000" opacity="0.14" />
      <circle r={r} fill="#e3b068" />
      <circle r={r * 0.84} fill="#d63a1f" />
      <circle r={r * 0.74} fill="#f6d36a" />
      {PEPERONI.map(([x, y], i) => (
        <circle key={i} cx={x * r} cy={y * r} r={r * 0.16} fill="#b3241a" />
      ))}
      {cortes &&
        [0, 45, 90, 135].map((a) => <line key={a} x1={-r} x2={r} y1="0" y2="0" transform={`rotate(${a})`} stroke="#fff" strokeOpacity="0.8" strokeWidth="1.6" />)}
    </g>
  )
}

function ArtePedido() {
  return (
    <g>
      <rect x="12" y="26" width="66" height="54" rx="9" className="pl-bench" />
      <rect x="20" y="34" width="50" height="22" rx="4" className="pl-tela" />
      <path d="M26 41h26M26 48h18" className="pl-tela-linha" />
      <circle cx="62" cy="68" r="4" fill="var(--ok)" />
      <g className="pl-ticket">
        <path d="M26 84h38v56l-5-4-5 4-5-4-5 4-5-4-5 4-4-4z" fill="#fff" stroke="var(--border)" />
        <path d="M32 96h26M32 106h26M32 116h16" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" />
      </g>
    </g>
  )
}

function ArteMontagem() {
  const insumos = ['#d63a1f', '#f1cf5f', '#4f9d47', '#3a3a3a']
  return (
    <g>
      <rect x="16" y="14" width="168" height="34" rx="8" className="pl-bench" />
      {insumos.map((cor, i) => (
        <g key={cor} transform={`translate(${26 + i * 40} 20)`}>
          <rect width="32" height="22" rx="5" fill={cor} opacity="0.9" />
          <circle cx="9" cy="8" r="2.4" fill="#fff" opacity="0.5" />
          <circle cx="21" cy="14" r="2.4" fill="#fff" opacity="0.5" />
        </g>
      ))}
      <rect x="16" y="62" width="168" height="104" rx="10" className="pl-bench" />
      <Pizza cx={56} cy={114} r={24} />
      <Pizza cx={106} cy={114} r={24} />
      <Pizza cx={156} cy={114} r={24} />
    </g>
  )
}

function ArteForno() {
  const chamas = [44, 94, 144, 194, 244]
  return (
    <g>
      <rect x="10" y="26" width="290" height="128" rx="14" className="pl-forno" />
      <rect x="22" y="58" width="266" height="64" rx="6" className="pl-esteira" />
      <line x1="22" x2="288" y1="90" y2="90" className="pl-correia" />
      {[0, 1, 2].map((i) => (
        <g key={i} className="pl-no-forno" style={{ animationDelay: `${-i * 2.4}s` }}>
          <Pizza cx={50} cy={90} r={19} />
        </g>
      ))}
      {chamas.map((x, i) => (
        <g key={x}>
          <path className="pl-chama" style={{ animationDelay: `${-i * 0.23}s` }} transform={`translate(${x} 56)`} d="M0 0C-7-8-3-14 0-22 3-14 7-8 0 0Z" />
          <path className="pl-chama" style={{ animationDelay: `${-i * 0.31}s` }} transform={`translate(${x + 24} 124) scale(1 -1)`} d="M0 0C-7-8-3-14 0-22 3-14 7-8 0 0Z" />
        </g>
      ))}
    </g>
  )
}

function ArtePorta() {
  return (
    <g>
      <rect x="12" y="26" width="106" height="132" rx="10" className="pl-bench" />
      <Pizza cx={54} cy={72} r={28} cortes />
      <g transform="translate(94 56)">
        <circle r="10" fill="#cfcfcf" stroke="#8a8a8a" strokeWidth="2" />
        <circle r="2.5" fill="#8a8a8a" />
        <line x1="10" y1="0" x2="26" y2="14" stroke="#8a8a8a" strokeWidth="5" strokeLinecap="round" />
      </g>
      {[
        [24, 114, 44, 34],
        [66, 110, 44, 34],
      ].map(([x, y, w, h]) => (
        <g key={x}>
          <rect x={x} y={y} width={w} height={h} rx="4" fill="#d9b27c" stroke="#a97d43" strokeWidth="1.6" />
          <rect x={x} y={y + h / 2 - 4} width={w} height="8" fill="var(--primary)" />
        </g>
      ))}
    </g>
  )
}

function ArteDespacho() {
  return (
    <g>
      <rect x="12" y="26" width="116" height="132" rx="10" className="pl-bench" />
      {[24, 72].map((x) => (
        <g key={x}>
          <rect x={x} y="40" width="36" height="46" rx="3" fill="#c99a5e" stroke="#9a7040" strokeWidth="1.6" />
          <path d={`M${x + 8} 40q10-16 20 0`} fill="none" stroke="#7a5430" strokeWidth="2.2" />
          <rect x={x} y="40" width="36" height="9" fill="#b98748" />
        </g>
      ))}
      {[
        [32, '#d12'],
        [58, '#2a9d5c'],
        [84, '#8a8a8a'],
      ].map(([x, cor]) => (
        <g key={x}>
          <circle cx={x} cy="114" r="10" fill={cor} />
          <circle cx={x} cy="114" r="4" fill="#fff" opacity="0.7" />
        </g>
      ))}
      <rect x="96" y="102" width="22" height="24" rx="3" fill="#d9b27c" stroke="#a97d43" strokeWidth="1.4" />
    </g>
  )
}

const ARTE = { montagem: ArteMontagem, forno: ArteForno, porta: ArtePorta, despacho: ArteDespacho }

function Moto() {
  return (
    <g transform={`translate(${X_SAIDA} ${CY})`}>
     <g className="pl-moto">
      <g className="pl-vento">
        <line x1="-62" y1="-12" x2="-46" y2="-12" />
        <line x1="-70" y1="0" x2="-46" y2="0" />
        <line x1="-62" y1="12" x2="-46" y2="12" />
      </g>
      <rect x="-24" y="-4" width="16" height="8" rx="3" fill="#1d1d1d" />
      <rect x="16" y="-4" width="18" height="8" rx="3" fill="#1d1d1d" />
      <rect x="-20" y="-9" width="42" height="18" rx="9" fill="var(--primary)" />
      <rect x="-42" y="-13" width="22" height="26" rx="4" fill="#fff" stroke="var(--primary)" strokeWidth="2.5" />
      <path d="M-37 -5h12M-37 1h12" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
      <line x1="14" y1="-15" x2="14" y2="15" stroke="#1d1d1d" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="-4" cy="0" rx="8" ry="13" fill="#3a3a3a" />
      <circle cx="0" cy="0" r="7" fill="#f4f4f4" stroke="#1d1d1d" strokeWidth="2" />
     </g>
    </g>
  )
}

function Estacao({ e, tempo, gargalo, kdsFora }) {
  const { x, w } = EST[e.id]
  const nivel = nivelEtapa(tempo, e.meta)
  const dif = tempo - e.meta
  const Arte = ARTE[e.id]
  return (
    <g className="pl-est" data-n={nivel} transform={`translate(${x} ${Y})`}>
      <title>{`${e.nome}: ${dec1(tempo)} min (meta ${dec1(e.meta)}). ${e.onde}`}</title>
      {gargalo && <rect className="pl-pulso" x="-4" y="-4" width={w + 8} height={H + 8} rx="20" />}
      <rect className="pl-base" width={w} height={H} rx="16" />
      <Arte />
      {gargalo && kdsFora && (
        <g className="pl-kds-off" transform={`translate(${w - 58} ${H - 44})`}>
          <rect width="48" height="34" rx="6" fill="var(--surface)" stroke="var(--bad)" strokeWidth="2.5" />
          <path d="M14 9l20 16M34 9L14 25" stroke="var(--bad)" strokeWidth="3" strokeLinecap="round" />
          <path d="M24 34v6q0 6 8 6" fill="none" stroke="var(--bad)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 4" />
        </g>
      )}
      <g transform={`translate(${w / 2} -34)`}>
        <rect className="pl-selo" x="-64" y="-23" width="128" height="46" rx="23" />
        <text className="pl-num" y="9" textAnchor="middle">
          {dec1(tempo)}
          <tspan className="pl-un" dx="5">
            min
          </tspan>
        </text>
      </g>
      {gargalo && (
        <g transform={`translate(${w / 2} -80)`}>
          <rect className="pl-bandeira" x="-62" y="-11" width="124" height="22" rx="11" />
          <text className="pl-bandeira-txt" y="4.5" textAnchor="middle">
            {kdsFora ? 'CONFIRA O KDS' : 'GARGALO'}
          </text>
        </g>
      )}
      <text className="pl-nome" x={w / 2} y={H + 28} textAnchor="middle">
        {e.nome}
      </text>
      <text className="pl-meta" x={w / 2} y={H + 48} textAnchor="middle">
        meta {dec1(e.meta)} min
        <tspan className="pl-delta" dx="6">
          {Math.abs(dif) < 0.05 ? 'na meta' : `${dif > 0 ? '+' : '−'}${dec1(Math.abs(dif))}`}
        </tspan>
      </text>
    </g>
  )
}

function Linha({ med, total }) {
  const X0 = 40
  const LARG = 940
  const ppm = LARG / (Math.max(total, META_ENTREGA) * 1.08)
  let acc = X0
  const xMeta = X0 + META_ENTREGA * ppm
  const xFim = X0 + total * ppm
  const nivel = nivelDespacho(total)
  return (
    <g transform="translate(0 404)">
      <text className="pl-lin-tit" x={X0} y="-10">
        Quanto cada etapa consome do tempo até o despacho
      </text>
      {ETAPAS.map((e) => {
        const larg = med[e.id] * ppm
        const x = acc
        acc += larg
        const n = nivelEtapa(med[e.id], e.meta)
        return (
          <g key={e.id} data-n={n} className="pl-seg">
            <rect x={x + 1} width={Math.max(larg - 2, 1)} height="26" rx="6" />
            {larg > 58 && (
              <text x={x + larg / 2} y="17.5" textAnchor="middle">
                {larg > 96 ? e.nome : e.nome.split(' ')[0]} {dec1(med[e.id])}
              </text>
            )}
          </g>
        )
      })}
      <g className="pl-meta-lin">
        <path d={`M${xMeta} -7V0M${xMeta} 26V34`} />
        <text x={xMeta} y="46" textAnchor="middle">
          Meta {META_ENTREGA} min
        </text>
      </g>
      <g data-n={nivel} className="pl-fim">
        <circle cx={xFim} cy="13" r="6" />
        <text x={Math.min(xFim + 12, X0 + LARG - 4)} y="46" textAnchor={xFim + 12 > X0 + LARG - 120 ? 'end' : 'start'}>
          Despacho em {dec1(total)} min
        </text>
      </g>
    </g>
  )
}

export default function PlantaKds({ med, kdsFora = false }) {
  const uid = useId().replace(/:/g, '')
  const gargalo = maiorGargalo(med)
  const temGargalo = gargalo.excesso > 0.05 && nivelEtapa(gargalo.valor, gargalo.meta) !== 'ok'
  const animar = typeof window === 'undefined' || !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const { keyTimes, keyPoints } = roteiro(med)
  const nivelTotal = nivelDespacho(med.total)
  const resumo = `Planta da cozinha dos Holandeses. ${ETAPAS.map((e) => `${e.nome} ${dec1(med[e.id])} min`).join(', ')}. Pedido até o despacho em ${dec1(med.total)} min, para uma meta de ${META_ENTREGA} min.`

  return (
    <div className="planta">
      <svg className="planta-svg" viewBox={`0 0 ${W} ${H_SVG}`} role="img" aria-label={resumo}>
        <defs>
          <pattern id={`piso${uid}`} width="40" height="40" patternUnits="userSpaceOnUse">
            <rect width="40" height="40" className="pl-piso-a" />
            <rect width="20" height="20" className="pl-piso-b" />
            <rect x="20" y="20" width="20" height="20" className="pl-piso-b" />
          </pattern>
          <path id={`trilha${uid}`} d={TRILHA} />
        </defs>

        <rect className="pl-parede" x="12" y="12" width="998" height="446" rx="18" />
        <rect className="pl-piso" x="18" y="18" width="986" height="434" rx="14" fill={`url(#piso${uid})`} />
        <rect className="pl-porta-vao" x="1002" y={CY - 30} width="16" height="60" />
        <path className="pl-porta" d={`M1010 ${CY - 30}l20 -12M1010 ${CY + 30}l20 12`} />

        <path className="pl-trilha" d={TRILHA} />
        {[129, 352, 687, 842].map((x) => (
          <path key={x} className="pl-seta" transform={`translate(${x} ${CY})`} d="M-5 -8L5 0L-5 8" />
        ))}

        <g transform={`translate(28 ${Y})`}>
          <rect className="pl-base pl-neutra" width="90" height={H} rx="16" />
          <ArtePedido />
          <text className="pl-nome" x="45" y={H + 28} textAnchor="middle">
            Pedido cai
          </text>
          <text className="pl-meta" x="45" y={H + 48} textAnchor="middle">
            relógio começa
          </text>
        </g>

        {ETAPAS.map((e) => (
          <Estacao key={e.id} e={e} tempo={med[e.id]} gargalo={temGargalo && gargalo.id === e.id} kdsFora={kdsFora} />
        ))}

        <Moto />
        <text className="pl-nome" x={X_SAIDA} y={CY + 56} textAnchor="middle">
          Motoboy sai
        </text>
        <text className="pl-meta" x={X_SAIDA} y={CY + 74} textAnchor="middle">
          fim da contagem
        </text>

        <Linha med={med} total={med.total} />

        {animar &&
          [0, -CICLO_S / 2].map((inicio) => (
            <g key={inicio} className="pl-viajante">
              <Pizza r={15} />
              <animateMotion dur={`${CICLO_S}s`} begin={`${inicio}s`} repeatCount="indefinite" calcMode="linear" keyPoints={keyPoints} keyTimes={keyTimes}>
                <mpath href={`#trilha${uid}`} />
              </animateMotion>
            </g>
          ))}
      </svg>

      <ol className="planta-lista" aria-label="Tempo de cada etapa até o despacho">
        {ETAPAS.map((e) => {
          const n = nivelEtapa(med[e.id], e.meta)
          return (
            <li key={e.id} data-n={n}>
              <strong>{e.nome}</strong>
              <span className="pl-li-tempo">{dec1(med[e.id])} min</span>
              <small>meta {dec1(e.meta)} min{temGargalo && gargalo.id === e.id ? ' · gargalo' : ''}</small>
            </li>
          )
        })}
        <li data-n={nivelTotal} className="pl-li-total">
          <strong>Pedido até despacho</strong>
          <span className="pl-li-tempo">{dec1(med.total)} min</span>
          <small>meta {META_ENTREGA} min</small>
        </li>
      </ol>

      <ul className="planta-leg">
        <li data-n="ok">Na meta</li>
        <li data-n="warn">Até 1 min acima</li>
        <li data-n="bad">Mais de 1 min acima</li>
        <li className="planta-aviso">Esquema ilustrativo, sem medidas reais. A pizza para em cada estação pelo tempo médio dela.</li>
      </ul>
    </div>
  )
}
