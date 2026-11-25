import { ArrowRight, TrendingDown } from 'lucide-react'
import { LOJAS } from '../data/daily'
import { conferencia } from '../data/estoque'
import { sinal } from '../data/format'
import Card, { Pill } from './Card'

// Regra da P-005: só itens cuja divergência cresce em contagens seguidas. Nunca por pessoa.
export default function DivergenciaCrescente({ loja, i = 0 }) {
  const lista = conferencia(loja)
    .filter((x) => x.recorrente)
    .sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff))
  return (
    <Card i={i} title="Divergência crescente" sub="Itens em que a falta aumenta a cada contagem. Indica onde olhar (receita, porção, validade, lançamento), não quem." right={<Pill tom={lista.length ? 'red' : 'gray'}>{lista.length} item{lista.length === 1 ? '' : 's'}</Pill>}>
      {lista.length === 0 ? (
        <p className="muted">Nenhum item com divergência crescente nas últimas 3 contagens.</p>
      ) : (
        <ul className="historico">
          {lista.map((x) => (
            <li key={`${x.loja}-${x.nome}`}>
              <TrendingDown size={20} aria-hidden="true" className="ic-warn" />
              <span className="hist-info">
                <strong>{LOJAS[x.loja].nome}: {x.nome}</strong>
                <span className="trilha-div">
                  {x.hist.map((h, k) => (
                    <span key={k}>
                      {k > 0 && <ArrowRight size={12} aria-hidden="true" />} {sinal(h)}
                    </span>
                  ))}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
