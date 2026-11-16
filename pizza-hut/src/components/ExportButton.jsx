import { useEffect, useRef, useState } from 'react'
import { Download, FileSpreadsheet, Printer } from 'lucide-react'
import { useRecorte } from '../state/DashContext'
import { LOJAS } from '../data/daily'

const CAMPOS = [
  ['date', 'Data'],
  ['loja', 'Loja'],
  ['pedidos', 'Pedidos'],
  ['bruto', 'Faturamento bruto (R$)'],
  ['descontos', 'Descontos (R$)'],
  ['taxas', 'Taxas e comissões (R$)'],
  ['liquido', 'Líquido (R$)'],
  ['tempo', 'Tempo médio de entrega (min)'],
  ['dentro', 'Dentro da meta (%)'],
  ['desperdicio', 'Desperdício (R$)'],
  ['cmv', 'CMV (%)'],
  ['nota', 'Nota iFood'],
  ['cancel', 'Cancelamento iFood (%)'],
  ['acordo', 'Taxa de acordo iFood (%)'],
]

const celula = (k, v) => {
  if (k === 'loja') return LOJAS[v].nome
  if (typeof v === 'number') return v.toFixed(2).replace('.', ',')
  return v
}

export default function ExportButton() {
  const { rows, periodo, loja } = useRecorte()
  const [aberto, setAberto] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const fora = (e) => ref.current && !ref.current.contains(e.target) && setAberto(false)
    document.addEventListener('mousedown', fora)
    return () => document.removeEventListener('mousedown', fora)
  }, [])

  const baixarCsv = () => {
    const linhas = [CAMPOS.map(([, r]) => r).join(';')]
    for (const r of rows) linhas.push(CAMPOS.map(([k]) => celula(k, r[k])).join(';'))
    const blob = new Blob(['﻿' + linhas.join('\n')], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `pizza-hut-bi_${loja}_${periodo}.csv`
    a.click()
    URL.revokeObjectURL(a.href)
    setAberto(false)
  }

  return (
    <div className="menu-wrap no-print" ref={ref}>
      <button className="btn-top" onClick={() => setAberto((a) => !a)} aria-haspopup="menu" aria-expanded={aberto}>
        <Download size={16} aria-hidden="true" />
        <span className="btn-rot">Exportar</span>
      </button>
      {aberto && (
        <div className="menu" role="menu">
          <button role="menuitem" onClick={baixarCsv}>
            <FileSpreadsheet size={16} aria-hidden="true" /> Baixar CSV do período
          </button>
          <button
            role="menuitem"
            onClick={() => {
              setAberto(false)
              setTimeout(() => window.print(), 60)
            }}
          >
            <Printer size={16} aria-hidden="true" /> Imprimir ou salvar em PDF
          </button>
        </div>
      )}
    </div>
  )
}
