# Entrega 1 — User Flow (Semana 01)

Entregável da Semana 01: User Flow do fluxo de **login e envio de Pix** no protótipo
techX (ver [Entrega 2](../entrega2-nocode-doc/)), representando o caminho que a titular
da conta percorre para transferir dinheiro.

## Link do arquivo (FigJam)

**[User Flow — Enviar Pix (techX)](https://www.figma.com/board/PWHQcrea0yJjOVQd6oNa6l)**

> ⚠️ **Pendência**: o arquivo foi criado via API e por padrão fica com acesso restrito à
> minha conta. Preciso abrir o link logado no Figma e mudar o compartilhamento para
> **"Qualquer pessoa com o link pode visualizar"** antes de entregar — nenhuma ferramenta
> automatizada tem permissão para alterar essa configuração.

Uma cópia estática do diagrama gerado fica em [`docs/user-flow-pix.svg`](docs/user-flow-pix.svg)
para referência, caso o link do Figma mude.

## O que o fluxo mostra

| Elemento pedido no enunciado | Onde aparece no fluxo |
| --- | --- |
| Ponto de entrada | "Abre o app" → tela de Login |
| Principais etapas da jornada | Login → Início → Hub do Pix → escolher destinatário → digitar valor → confirmar |
| Ações realizadas pelo usuário | Rótulos das setas: "Toca em Pix", "Escolhe Enviar", "Confirma" |
| Decisões ou possíveis caminhos | Losangos: senha correta?, chave Pix válida?, saldo/limite ok?, transação aprovada? — cada um com o caminho de erro voltando para a etapa anterior |
| Resultado ou objetivo final | "Pix concluído" → gera comprovante → volta ao Início |

## Por que esse fluxo

O techX (banco digital com Pix) é o desafio desta matéria (ver contexto completo na
[Entrega 2](../entrega2-nocode-doc/README.md)). Entre as telas construídas em aula, o
envio de Pix é o único fluxo de ponta a ponta com decisões reais (validação de chave,
saldo, limite e resultado da transação), então foi o escolhido para representar como
User Flow — as demais telas (extrato, cartões, notificações) são consultas sem
ramificação de decisão relevante para este diagrama.

## Como foi feito

Gerado a partir da lógica de navegação já documentada no
[mapa de navegação do protótipo](../entrega2-nocode-doc/README.md#mapa-de-navegação),
usando a ferramenta de diagramas do FigJam (formas padrão de User Flow: oval para
início/fim, retângulo para etapa/ação, losango para decisão, setas para navegação).
