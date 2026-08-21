# Capacidades

Status de **contrato** = a interface/comportamento está definido.
Status de **implementação** = existe código rodando.

| Capacidade | Contrato | Implementação | Onde |
|---|---|---|---|
| Sessão (login) | Parcial — sem regra real de autenticação | Fachada: aceita qualquer senha de 6 dígitos | `screens/Login.tsx` |
| Visão geral da conta | Definido | Completa | `screens/Home.tsx` |
| Ocultar/exibir saldo | Definido | Completa, persistida | `lib/useLocalStorage.ts` |
| Extrato por mês | Definido | Completa | `screens/Statement.tsx` |
| Busca e filtros do extrato | Definido | Completa (texto, tipo, categoria) | `lib/selectors.ts` |
| Gastos por categoria | Definido | Completa | `spendByCategory` |
| Detalhe da transação | Definido | Completa | `screens/TransactionDetail.tsx` |
| **Pix — enviar** | Definido | **Completa, ponta a ponta** | `lib/PixFlow.tsx` + 4 telas |
| Pix — validação | Definido | Completa: formato por tipo de chave, valor > 0, saldo, teto de R$ 5.000 | `PixRecipient.tsx`, `PixFlow.tsx` |
| Comprovante | Definido | Completa (do fluxo vivo e de transação com `receiptId`) | `screens/Receipt.tsx` |
| Pix — cobrar / copia e cola / QR | Não definido | Ausente — mostra aviso | `screens/PixHub.tsx` |
| Cartões — fatura e limite | Definido | Completa (leitura) | `screens/Cards.tsx` |
| Cartões — bloquear | Definido | Completa (estado local, reversível) | `screens/Cards.tsx` |
| Cartões — virtual, dados, aproximação | Não definido | Ausente — mostra confirmação visual | `screens/Cards.tsx` |
| Notificações | Definido | Completa (marcar lidas, limpar, estado vazio) | `screens/Notifications.tsx` |
| Perfil e configurações | Parcial | Navegação e layout prontos; itens não abrem | `screens/More.tsx` |
| Pagar / Transferir / Recarga | Não definido | Ausente — abre bottom sheet explicando | `screens/Home.tsx` |
| Persistência de dados | Não definido | Ausente — só `localStorage` do saldo oculto | — |
| Backend / API | Não definido | Ausente | — |

## Estados de UI cobertos

| Estado | Onde aparece |
|---|---|
| Carregando (skeleton) | Home, Extrato |
| Erro com "tentar de novo" | Home, Extrato (`ErrorState`) |
| Vazio | Extrato (busca sem resultado), Notificações (lista limpa), busca de contato no Pix |
| Validação inline | Chave Pix (por tipo), valor do Pix |
| Confirmação (toast) | Ações de cartão, comprovante, notificações |
| Envio em progresso | Botão do login e do "Confirmar e enviar" |
| Não encontrado | `/transacao/:id` e `/comprovante/:id` inexistentes |
