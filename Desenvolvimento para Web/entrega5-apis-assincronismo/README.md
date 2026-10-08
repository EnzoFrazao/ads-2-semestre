# Entrega 5 — Objetos, Dados e Assincronismo

Projeto com três partes: validação/filtragem de um array de pedidos, um
buscador de CEP (ViaCEP) e uma mini Pokédex (PokéAPI), ambos consumindo API
real com `fetch` + `async/await` e tratando os quatro estados de tela.

## Como testar

Abra o `index.html` no navegador com o Console aberto (F12). A Parte 1
imprime seus resultados no console; as Partes 2 e 3 têm formulários na
própria página.

## Os quatro estados de tela

Tanto o buscador de CEP quanto a Pokédex tratam os mesmos quatro estados:

1. **Carregando** — desabilita o botão e mostra "Buscando..." antes do
   `await fetch(...)` resolver.
2. **Erro** — `try/catch` cobre falha de rede e `AbortSignal.timeout(5000)`
   evita que a requisição fique pendurada; erros HTTP são detectados com
   `if (!resposta.ok)`, porque o `fetch` **não rejeita a Promise** em 404/500.
3. **Vazio/Não encontrado** — CEP: a API ViaCEP responde `200 OK` com
   `{ erro: true }` para CEP inexistente, então isso é verificado explicitamente.
   Pokémon: a PokéAPI responde `404`, verificado via `resposta.status === 404`.
4. **Sucesso** — `replaceChildren()` limpa o resultado anterior antes de
   inserir os novos elementos (`createElement` + `textContent`, nunca
   `innerHTML`, para não expor a página a XSS com dados vindos de fora).

## Bônus — histórico de CEPs

Cada busca de CEP bem-sucedida é guardada em `historicoDeCeps` (array de
objetos `{ cep, cidade, uf }`) e também listada na tela em `#historico-cep`.

## Parte 4 — Reflexão

**Por que `Promise.all` pode ser mais rápido que vários `await` seguidos?**

Um `await` sequencial só dispara a próxima requisição depois que a anterior
terminar — o tempo total é a **soma** do tempo de cada requisição. Já
`Promise.all([promessaA, promessaB, ...])` dispara **todas as requisições ao
mesmo tempo** e só continua quando a última delas resolver — o tempo total
fica próximo do tempo da requisição **mais lenta**, não da soma de todas.
Isso aproveita melhor a rede, já que as requisições não dependem umas das
outras (o resultado de uma não é usado para montar a outra).
