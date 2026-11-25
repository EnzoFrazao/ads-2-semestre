import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, Copy, FileText, Printer, X } from 'lucide-react'
import { DAILY, DIAS, END, LOJAS, META_ENTREGA, addDays, dowOf } from '../data/daily'
import { sinais } from '../data/alertas'
import { brl, dataLonga, dec1, int, pct, sinal } from '../data/format'
import { variacao } from '../data/metrics'

const pegar = (data, loja) => DAILY.find((r) => r.date === data && r.loja === loja)

function linhasLoja(l) {
  const r = pegar(END, l)
  const antes = pegar(addDays(END, -7), l)
  return {
    nome: LOJAS[l].nome,
    itens: [
      ['Pedidos', int(r.pedidos), sinal(variacao(r.pedidos, antes.pedidos))],
      ['Faturamento bruto', brl(r.bruto), sinal(variacao(r.bruto, antes.bruto))],
      ['Pedido até despacho', `${dec1(r.tempo)} min`, sinal(variacao(r.tempo, antes.tempo))],
      [`Despachado em até ${META_ENTREGA} min`, pct(r.dentro, 0), sinal(variacao(r.dentro, antes.dentro))],
      ['CMV', pct(r.cmv), sinal(variacao(r.cmv, antes.cmv))],
      ['Desperdício', brl(r.desperdicio), sinal(variacao(r.desperdicio, antes.desperdicio))],
    ],
  }
}

export function montarResumo() {
  const dia = `${DIAS[dowOf(END)]}, ${dataLonga(END)}`
  const lojas = ['h', 'r'].map(linhasLoja)
  const alertas = sinais('all').filter((a) => a.id !== 'defasagem').slice(0, 3)
  const texto = [
    `*Resumo do dia: ${dia}*`,
    ...lojas.flatMap((l) => ['', `*${l.nome}*`, ...l.itens.map(([r, v, d]) => `• ${r}: ${v} (${d} contra o mesmo dia da semana anterior)`)]),
    '',
    '*Atenção*',
    ...alertas.map((a) => `• ${a.titulo}`),
    '',
    'Dados fictícios do protótipo.',
  ].join('\n')
  return { dia, lojas, alertas, texto }
}

export default function ResumoDiario({ aberto, onFechar }) {
  const [copiado, setCopiado] = useState(false)
  useEffect(() => {
    if (!aberto) return undefined
    const esc = (e) => e.key === 'Escape' && onFechar()
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [aberto, onFechar])
  if (!aberto) return null
  const r = montarResumo()

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(r.texto)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2200)
    } catch {
      setCopiado(false)
    }
  }
  const imprimir = () => {
    document.body.classList.add('print-resumo')
    const limpar = () => {
      document.body.classList.remove('print-resumo')
      window.removeEventListener('afterprint', limpar)
    }
    window.addEventListener('afterprint', limpar)
    setTimeout(() => window.print(), 60)
  }

  return createPortal(
    <div className="resumo-overlay" role="dialog" aria-modal="true" aria-label="Resumo do dia" onMouseDown={(e) => e.target === e.currentTarget && onFechar()}>
      <div className="resumo">
        <header className="resumo-topo">
          <h2>
            <FileText size={20} aria-hidden="true" /> Resumo do dia
          </h2>
          <button className="btn-top btn-icone no-print" onClick={onFechar} aria-label="Fechar resumo">
            <X size={18} aria-hidden="true" />
          </button>
        </header>
        <p className="resumo-dia">{r.dia} · variação contra o mesmo dia da semana anterior</p>
        <div className="resumo-lojas">
          {r.lojas.map((l) => (
            <section key={l.nome}>
              <h3>{l.nome}</h3>
              <dl>
                {l.itens.map(([rot, val, d]) => (
                  <div key={rot}>
                    <dt>{rot}</dt>
                    <dd>
                      <strong>{val}</strong> <span>{d}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
        <section className="resumo-atencao">
          <h3>Atenção</h3>
          <ul>
            {r.alertas.map((a) => (
              <li key={a.id} data-n={a.nivel}>
                {a.titulo}
              </li>
            ))}
          </ul>
        </section>
        <p className="muted resumo-nota">Protótipo com dados fictícios.</p>
        <footer className="resumo-acoes no-print">
          <button className="btn-prim" onClick={copiar}>
            {copiado ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />} {copiado ? 'Copiado' : 'Copiar texto para o celular'}
          </button>
          <button className="btn-sec" onClick={imprimir}>
            <Printer size={16} aria-hidden="true" /> Imprimir ou salvar em PDF
          </button>
        </footer>
      </div>
    </div>,
    document.body,
  )
}
