import { AlertOctagon, AlertTriangle } from 'lucide-react'
import { useDash } from '../state/DashContext'
import { horasDesdeCarga, nivelFrescor, textoDefasagem } from '../data/frescor'
import { dataLonga } from '../data/format'

// Avisa quando a última carga ficou velha: os números na tela podem não refletir a operação de hoje.
export default function AvisoDados() {
  const { ultimaCarga, agora, irPara } = useDash()
  const horas = horasDesdeCarga(ultimaCarga, agora)
  const nivel = nivelFrescor(horas)
  if (nivel === 'ok') return null
  const Icone = nivel === 'bad' ? AlertOctagon : AlertTriangle
  return (
    <div className={`aviso-dados aviso-${nivel} no-print`} role="status">
      <Icone size={18} aria-hidden="true" />
      <span>
        <strong>Dados desatualizados:</strong> a última carga foi {textoDefasagem(horas)} ({dataLonga(ultimaCarga.data)}, {ultimaCarga.hora}). Os números podem não refletir o que aconteceu desde então.
      </span>
      <button className="btn-sec" onClick={() => irPara('dados')}>
        Ver cargas
      </button>
    </div>
  )
}
