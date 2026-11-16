// Composição do desperdício (fictícia). Os percentuais somam 100% e são aplicados ao total do período.
export const DESP_TIPOS = [
  { nome: 'Massa', share: 0.38 },
  { nome: 'Queijo', share: 0.21 },
  { nome: 'Borda recheada', share: 0.11 },
  { nome: 'Frios e carnes', share: 0.1 },
  { nome: 'Molhos', share: 0.08 },
  { nome: 'Bebidas', share: 0.06 },
  { nome: 'Outros', share: 0.06 },
]

export const DESP_CAUSAS = [
  { nome: 'Vencimento', share: 0.34 },
  { nome: 'Erro de produção', share: 0.27 },
  { nome: 'Pedido devolvido', share: 0.19 },
  { nome: 'Sobra de produção', share: 0.14 },
  { nome: 'Quebra e acidente', share: 0.06 },
]

export const CANAIS = [
  { id: 'salao', nome: 'Salão' },
  { id: 'ifood', nome: 'iFood' },
  { id: 'balcao', nome: 'Balcão e retirada' },
  { id: 'app', nome: 'App próprio' },
]

// Mix de sabores: participação por loja (fictícia)
export const SABORES = [
  { nome: 'Calabresa', h: 17, r: 19 },
  { nome: 'Muçarela', h: 14, r: 16 },
  { nome: 'Portuguesa', h: 11, r: 8 },
  { nome: 'Frango com catupiry', h: 12, r: 15 },
  { nome: 'Pepperoni', h: 13, r: 9 },
  { nome: 'Quatro queijos', h: 9, r: 7 },
  { nome: 'Margherita', h: 7, r: 4 },
  { nome: 'Bacon', h: 6, r: 8 },
  { nome: 'Doce (chocolate)', h: 6, r: 10 },
  { nome: 'Outros', h: 5, r: 4 },
]
