# Entrega 3 — Modularização e Organização de Código (Semana 03)

Entregável da Semana 03: funções, parâmetros, retorno, escopo e módulos.

## Conteúdo obrigatório

| Arquivo | O que faz |
| --- | --- |
| `calculadora.py` / `.por` | Módulo com `somar`, `subtrair`, `multiplicar` e `dividir`. A `dividir` trata a divisão por zero (avisa o usuário e devolve `None`), sem quebrar o programa. |
| `utilidades.py` / `.por` | Módulo com os desafios da Prática Independente: `celsius_para_fahrenheit`, `validar_senha`, `caixa(*precos)` (total, mais caro e média) e `ficha_aluno(**dados)`. |
| `script_principal.py` / `.por` | Importa `calculadora` e `utilidades` e chama suas funções, demonstrando o reaproveitamento de código. Também define `adicionar_item_seguro`, a função de **lista segura** (cópia defensiva, não altera a lista original). |

## Conteúdo bônus (opcional)

| Arquivo | O que faz |
| --- | --- |
| `estatistica.py` / `.por` | `media`, `mediana` e `moda` de uma lista de números. |
| `bonus.py` / `.por` | Importa `estatistica` com o apelido `est`, define `fatorial(n)` recursivo e `relatorio(titulo, *linhas, **config)`. |

## Como executar

```bash
python script_principal.py
python bonus.py
```

Os desafios importam `calculadora.py`, `utilidades.py` e `estatistica.py`, então rode-os
de dentro desta pasta. Rodar `python calculadora.py` (ou `utilidades.py`, `estatistica.py`)
direto executa uma demonstração isolada — o bloco `if __name__ == "__main__":` garante que
essa demonstração **não** roda quando o módulo é importado pelos outros scripts.

Os arquivos `.por` abrem no [Portugol Studio](http://lite.acordo.repl.co/).

## Observações sobre o Portugol

- O Portugol Studio não tem `import`: nos `.por` de `calculadora` e `utilidades`, as
  funções ficam declaradas dentro do próprio programa — a ideia de reaproveitar a função
  continua a mesma, só muda o mecanismo. Por isso `script_principal.por` também as
  redeclara, em vez de usar `inclua biblioteca` (evita conflito entre os `funcao inicio()`
  de dois programas independentes).
- `bonus.por` já usa `inclua biblioteca estatistica --> est`, reproduzindo o alias `est`
  pedido no desafio — diferente de `calculadora`/`utilidades`, aqui não há função
  `inicio()` de demonstração dentro de `estatistica.por` conflitando com o uso.
- Não existe `try/except`: a divisão por zero é evitada com um `se` antes de dividir.
- Não existem `*args`/`**kwargs`: `caixa` e `relatorio` usam vetor + tamanho; `ficha_aluno`
  usa parâmetros fixos no lugar do dicionário livre do Python.

## Padrões

- Nomes de arquivos, funções e variáveis em `snake_case` (PEP 8).
- Todas as funções Python têm docstring.
- `None` nunca é usado como valor padrão problemático: a cópia defensiva da lista segura é
  feita com `lista[:]`, evitando o bug clássico de lista mutável como argumento padrão.
- Todos os scripts foram executados e rodam sem erro.
