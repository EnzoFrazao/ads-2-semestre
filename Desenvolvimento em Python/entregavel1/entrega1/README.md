# Entrega 1 — Python: Módulos

Entrega da aula de **Módulos**. Todos os arquivos desta entrega estão nesta pasta.

## Conteúdo

| Arquivo | O que faz |
| --- | --- |
| `calculadora.py` | Módulo com `somar`, `subtrair`, `multiplicar` e `dividir`. A `dividir` trata a divisão por zero com `try/except ZeroDivisionError`, avisa o usuário e devolve `None`. |
| `desafio_1_par_ou_impar.py` | Lê um número inteiro e informa se é par ou ímpar. |
| `desafio_2_media_notas.py` | Lê 3 notas e calcula a média **importando** `somar` e `dividir` do módulo. Informa aprovado/reprovado. |
| `desafio_3_tabuada.py` | Mostra a tabuada de 1 a 10 usando `multiplicar` do módulo. |
| `desafio_4_maior_de_tres.py` | Lê 3 números e informa o maior, comparando com `if` (sem usar `max()`). |
| `desafio_5_calculadora_menu.py` | Menu interativo que usa as 4 funções do módulo. É onde o tratamento de divisão por zero aparece na prática. |

Cada exercício tem sua **versão equivalente em Portugol**, comentada, no arquivo
`.por` de mesmo nome (`desafio_1_par_ou_impar.por`, `calculadora.por`, etc.).

## Como executar

Os desafios importam `calculadora.py`, então rode-os de dentro desta pasta:

```bash
cd entrega1
python desafio_5_calculadora_menu.py
```

Rodar `python calculadora.py` direto executa uma demonstração das quatro
operações — o bloco `if __name__ == "__main__":` garante que essa demonstração
**não** roda quando o módulo é importado pelos desafios.

Os arquivos `.por` abrem no [Portugol Studio](http://lite.acordo.repl.co/).

## Observações sobre o Portugol

O Portugol Studio não tem `import`. Por isso, nos arquivos `.por`, as funções que
no Python moram em `calculadora.py` estão declaradas dentro do próprio programa —
a ideia de reaproveitar a função continua a mesma, só muda o mecanismo.

Também não existe `try/except`: a divisão por zero é evitada com um `se` antes de
dividir, em vez de ser capturada depois do erro.

## Padrões

- Nomes de arquivos, funções e variáveis em `snake_case` (PEP 8).
- Verificado com `pycodestyle` — sem avisos.
- Todos os desafios foram executados e rodam sem erro, incluindo os casos de
  entrada inválida e divisão por zero.
