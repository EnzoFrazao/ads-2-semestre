# Entrega 4 — Arrays, DOM e Eventos

Página simples (`index.html` + `app.js`) que demonstra métodos de array,
manipulação do DOM e eventos, incluindo *event delegation*.

## Como testar

Abra o `index.html` no navegador com o Console aberto (F12).

## Métodos de array utilizados

- **`forEach`** — percorre um array e executa uma ação para cada item
  (ex.: imprimir "Olá, NOME!" para cada nome), sem criar um novo array.
- **`map`** — transforma cada item e devolve **um novo array** do mesmo
  tamanho (ex.: nomes em maiúsculas, nomes extraídos dos produtos).
- **`filter`** — devolve **um novo array** só com os itens que passam num
  teste (ex.: preços acima de 20, produtos com preço menor que 50).
- **`reduce`** — percorre o array e acumula **um único valor** (ex.: soma de
  todos os preços).

## Manipulação do DOM

- `querySelector`/`querySelectorAll` para selecionar o `#titulo`, os `.texto`
  e os `<li>` da `#lista`.
- `innerHTML` para inserir HTML bruto (dois itens de uma vez) e
  `createElement`/`append` para criar elementos um a um via JavaScript.
- `classList.add`/`classList.contains`/`classList.toggle` para aplicar e
  consultar classes CSS sem reescrever o HTML manualmente.

## Event Delegation

Em vez de um `addEventListener` em cada `<li>`, é adicionado **um único**
listener de `click` na `<ul id="lista">`. Dentro dele, `evento.target` diz
exatamente qual elemento foi clicado — se for um `LI`, a classe `feito` é
alternada. Isso é importante porque:

1. Evita criar um listener por item (mais leve com listas grandes).
2. **Itens criados depois** (via `createElement`, pelo formulário, etc.)
   já funcionam automaticamente, porque o listener está no pai (`#lista`),
   não nos filhos — não é preciso reatribuir nada quando a lista muda.

O formulário (`#formulario`) usa `e.preventDefault()` para não recarregar a
página, lê e limpa o campo `#tarefa` (ignorando entradas vazias) e adiciona
o novo `<li>` à mesma lista, que já está sob o listener delegado.
