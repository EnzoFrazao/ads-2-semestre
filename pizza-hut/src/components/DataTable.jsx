import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp } from 'lucide-react'

// colunas: [{ k, rotulo, fmt?, align?, render?, sortable? }]
export default function DataTable({ colunas, linhas, total, maxAltura = 360, chave = (_, i) => i, inicial }) {
  const [ord, setOrd] = useState(inicial || null)
  const ordenadas = useMemo(() => {
    if (!ord) return linhas
    const col = colunas.find((c) => c.k === ord.k)
    const val = (l) => (col?.valor ? col.valor(l) : l[ord.k])
    return [...linhas].sort((a, b) => {
      const x = val(a)
      const y = val(b)
      const r = typeof x === 'string' ? x.localeCompare(y, 'pt-BR') : x - y
      return ord.dir === 'asc' ? r : -r
    })
  }, [linhas, ord, colunas])

  const alternar = (k) => setOrd((o) => (o?.k === k ? { k, dir: o.dir === 'asc' ? 'desc' : 'asc' } : { k, dir: 'desc' }))

  return (
    <div className="tabela-wrap" style={{ maxHeight: maxAltura }}>
      <table className="tabela">
        <thead>
          <tr>
            {colunas.map((c) => (
              <th key={c.k} style={{ textAlign: c.align || 'left' }} aria-sort={ord?.k === c.k ? (ord.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
                <button onClick={() => alternar(c.k)} className="th-btn">
                  {c.rotulo}
                  {ord?.k === c.k && (ord.dir === 'asc' ? <ArrowUp size={12} aria-hidden="true" /> : <ArrowDown size={12} aria-hidden="true" />)}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ordenadas.map((l, i) => (
            <tr key={chave(l, i)}>
              {colunas.map((c) => (
                <td key={c.k} style={{ textAlign: c.align || 'left' }}>
                  {c.render ? c.render(l) : c.fmt ? c.fmt(l[c.k]) : l[c.k]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {total && (
          <tfoot>
            <tr>
              {colunas.map((c) => (
                <td key={c.k} style={{ textAlign: c.align || 'left' }}>
                  {total[c.k] ?? ''}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  )
}
