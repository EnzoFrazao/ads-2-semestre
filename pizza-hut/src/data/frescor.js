import { diffDays } from './daily'

// "Agora" da demonstração: o painel abre na manhã seguinte ao último dia fechado.
export const AGORA_INICIAL = { data: '2026-11-11', hora: '10:00' }

// Limites de defasagem da carga, em horas. A frequência real ainda está em aberto (P-004).
export const LIMITE_ATENCAO_H = 26
export const LIMITE_CRITICO_H = 50

const minutos = (hora) => Number(hora.slice(0, 2)) * 60 + Number(hora.slice(3, 5))

export function horasDesdeCarga(carga, agora) {
  return (diffDays(carga.data, agora.data) * 1440 + minutos(agora.hora) - minutos(carga.hora)) / 60
}

export function nivelFrescor(horas) {
  if (horas > LIMITE_CRITICO_H) return 'bad'
  return horas > LIMITE_ATENCAO_H ? 'warn' : 'ok'
}

export function textoDefasagem(horas) {
  const h = Math.max(0, Math.round(horas))
  if (h < 1) return 'agora há pouco'
  if (h < 48) return `há ${h} h`
  return `há ${Math.floor(h / 24)} dias`
}
