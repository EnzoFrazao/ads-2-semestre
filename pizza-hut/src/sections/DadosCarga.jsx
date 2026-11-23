import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, CircleDashed, DatabaseZap, FileSpreadsheet, Loader2, Radio, UploadCloud } from 'lucide-react'
import { useDash } from '../state/DashContext'
import { dataLonga, int } from '../data/format'
import Card, { Pill, Status } from '../components/Card'

const ETAPAS = ['Lendo o arquivo', 'Conferindo as colunas', 'Validando tipos e datas', 'Procurando duplicidades', 'Procurando campos vazios', 'Gerando o relatório']

const RESULTADO = [
  { nivel: 'ok', texto: 'Linhas lidas', valor: 1842 },
  { nivel: 'ok', texto: 'Colunas esperadas encontradas', valor: '18 de 18' },
  { nivel: 'warn', texto: 'Datas fora do padrão (corrigidas)', valor: 3 },
  { nivel: 'warn', texto: 'Linhas duplicadas (removidas)', valor: 12 },
  { nivel: 'warn', texto: 'Campos vazios (para revisar)', valor: 5 },
]

const HISTORICO = [
  { quando: '10/11/2026, 08:04', origem: 'Sistema Pizza Hut', nivel: 'ok', nota: '1.790 linhas' },
  { quando: '09/11/2026, 08:01', origem: 'Sistema Pizza Hut', nivel: 'ok', nota: '1.744 linhas' },
  { quando: '08/11/2026, 09:12', origem: 'Toqan (iFood)', nivel: 'warn', nota: 'Atraso de 48 h' },
  { quando: '07/11/2026, 08:03', origem: 'Sistema Pizza Hut', nivel: 'ok', nota: '1.701 linhas' },
  { quando: '06/11/2026, 08:02', origem: 'Sistema Pizza Hut', nivel: 'bad', nota: 'Planilha inválida, carga recusada' },
]

export default function DadosCarga() {
  const { ultimaCarga, setUltimaCarga } = useDash()
  const [fase, setFase] = useState('espera') // espera | lendo | pronto | aplicado
  const [passo, setPasso] = useState(0)
  const [arquivo, setArquivo] = useState('')
  const [arrastando, setArrastando] = useState(false)
  const [historico, setHistorico] = useState(HISTORICO)
  const inputRef = useRef(null)

  useEffect(() => {
    if (fase !== 'lendo') return undefined
    if (passo >= ETAPAS.length) {
      setFase('pronto')
      return undefined
    }
    const t = setTimeout(() => setPasso((p) => p + 1), 650)
    return () => clearTimeout(t)
  }, [fase, passo])

  const iniciar = (nome) => {
    setArquivo(nome)
    setPasso(0)
    setFase('lendo')
  }

  const aplicar = () => {
    const agora = new Date()
    const hora = agora.toTimeString().slice(0, 5)
    setUltimaCarga({ data: '2026-11-11', hora })
    setHistorico((h) => [{ quando: `11/11/2026, ${hora}`, origem: arquivo, nivel: 'warn', nota: 'Carga manual, 3 alertas' }, ...h])
    setFase('aplicado')
  }

  return (
    <div className="secao">
      <div className="banner banner-info">
        <DatabaseZap size={18} aria-hidden="true" />
        <span>
          Esta tela é uma <strong>demonstração</strong>: o arquivo enviado não é processado de verdade, mas mostra como a carga, a validação e a data da última atualização funcionariam.
        </span>
      </div>

      <div className="grade g-3">
        <Card i={0} title="Sistema Pizza Hut" right={<Status nivel="ok">Atualizado</Status>}>
          <p className="fonte-linha">Vendas, histórico e desperdício. Operado por um funcionário.</p>
          <p className="fonte-forte">{dataLonga(ultimaCarga.data)}, {ultimaCarga.hora}</p>
          <p className="muted">Última carga</p>
        </Card>
        <Card i={1} title="Toqan (iFood)" right={<Status nivel="warn">48 h de atraso</Status>}>
          <p className="fonte-linha">Nota, cancelamento e taxa de acordo.</p>
          <p className="fonte-forte">09/11/2026, 09:12</p>
          <p className="muted">Dados até 48 horas anteriores</p>
        </Card>
        <Card i={2} title="KDS (produção)" right={<Pill tom="gray">Só Holandeses</Pill>}>
          <p className="fonte-linha">Tempo de cada etapa: montagem, forno, corte e despacho.</p>
          <p className="fonte-forte">
            <Radio size={20} aria-hidden="true" /> Holandeses ativo
          </p>
          <p className="muted">Renascença: compra solicitada, ainda sem KDS</p>
        </Card>
      </div>

      <div className="grade g-2e">
        <Card i={3} title="Enviar planilha" sub="Aceita .xlsx e .csv, como as exportações do sistema atual">
          <input ref={inputRef} type="file" accept=".xlsx,.xls,.csv" className="sr-only" onChange={(e) => e.target.files[0] && iniciar(e.target.files[0].name)} />
          {fase === 'espera' || fase === 'aplicado' ? (
            <div
              className={`dropzone ${arrastando ? 'on' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setArrastando(true) }}
              onDragLeave={() => setArrastando(false)}
              onDrop={(e) => { e.preventDefault(); setArrastando(false); const f = e.dataTransfer.files[0]; if (f) iniciar(f.name) }}
            >
              <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 2.4 }}>
                <UploadCloud size={38} aria-hidden="true" />
              </motion.div>
              <p><strong>Arraste a planilha aqui</strong> ou</p>
              <div className="dz-botoes">
                <button className="btn-prim" onClick={() => inputRef.current?.click()}>Escolher arquivo</button>
                <button className="btn-sec" onClick={() => iniciar('vendas_semana_45.xlsx')}>Usar planilha de exemplo</button>
              </div>
              {fase === 'aplicado' && <p className="dz-ok"><CheckCircle2 size={16} aria-hidden="true" /> Carga aplicada. A data da última carga foi atualizada no topo.</p>}
            </div>
          ) : (
            <div className="validacao">
              <p className="validacao-arq"><FileSpreadsheet size={18} aria-hidden="true" /> {arquivo}</p>
              <ul className="etapas">
                {ETAPAS.map((e, i) => {
                  const feito = i < passo
                  const ativo = i === passo && fase === 'lendo'
                  return (
                    <li key={e} className={feito ? 'feito' : ativo ? 'ativo' : ''}>
                      {feito ? <CheckCircle2 size={18} aria-hidden="true" /> : ativo ? <Loader2 size={18} className="gira" aria-hidden="true" /> : <CircleDashed size={18} aria-hidden="true" />}
                      {e}
                    </li>
                  )
                })}
              </ul>
              <AnimatePresence>
                {fase === 'pronto' && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="resultado">
                    <h4>Relatório de validação</h4>
                    <ul>
                      {RESULTADO.map((r) => (
                        <li key={r.texto}>
                          <Status nivel={r.nivel}>{r.nivel === 'ok' ? 'Ok' : 'Atenção'}</Status>
                          <span>{r.texto}</span>
                          <strong>{typeof r.valor === 'number' ? int(r.valor) : r.valor}</strong>
                        </li>
                      ))}
                    </ul>
                    <div className="dz-botoes">
                      <button className="btn-prim" onClick={aplicar}>Aplicar carga</button>
                      <button className="btn-sec" onClick={() => setFase('espera')}>Cancelar</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </Card>

        <Card i={4} title="Histórico de cargas" sub="Cada carga registra origem, horário e resultado">
          <ul className="historico">
            <AnimatePresence initial={false}>
              {historico.map((h) => (
                <motion.li key={h.quando + h.origem} layout initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
                  <Status nivel={h.nivel}>{h.nivel === 'ok' ? 'Ok' : h.nivel === 'warn' ? 'Atenção' : 'Recusada'}</Status>
                  <span className="hist-info">
                    <strong>{h.origem}</strong>
                    <span>{h.quando} · {h.nota}</span>
                  </span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
          <p className="muted nota-freq">Frequência de atualização ainda em aberto com o cliente: diária ou às segundas, quartas e sextas.</p>
          <p className="muted nota-freq">
            Se a fonte for planilha, as colunas precisam seguir o modelo fixo (a mesma exportação do painel, com as 4 etapas do KDS). Se os dados forem para o Power BI, a integração com Excel já existe e a planilha não precisa ser corrigida à mão.
          </p>
        </Card>
      </div>
    </div>
  )
}
