# Entrega 2 — Estruturas de Controle e Repetição (Semana 02)

Entregável da Semana 02: `if/elif/else`, `match/case`, `for` e `while`. Cada desafio tem
versão em Python (`.py`) e a versão equivalente comentada em Portugol (`.por`).

## Conteúdo

| Arquivo | O que faz |
| --- | --- |
| `desafio_1_classificador_cliente.py` / `.por` | Recebe idade e renda e classifica o cliente em Bronze, Prata, Ouro ou Diamante com `if/elif/else`. |
| `desafio_2_menu_operacoes.py` / `.por` | Menu com 4 operações matemáticas; executa a escolhida usando `match/case`. |
| `desafio_3_analise_numeros.py` / `.por` | Lê 5 números via `input()` e calcula soma, média, maior e menor valor com `for`. |
| `desafio_4_sistema_autenticacao.py` / `.por` | Pede a senha até acertar, contando tentativas e bloqueando após 3 erros com `while`. |

## Como executar

```bash
python desafio_1_classificador_cliente.py
```

Os arquivos `.por` abrem no [Portugol Studio](http://lite.acordo.repl.co/).

## Observações sobre o Portugol

- O `escolha/caso` do Portugol Studio precisa de `pare` em cada `caso` para não continuar
  para o próximo — diferente do `match/case` do Python, que já para sozinho.
- O `para` do Portugol declara inicialização, condição e incremento explicitamente, no
  lugar do `for i in range(n)` do Python.
- O `enquanto` depende de a variável de controle ser atualizada dentro do laço, assim como
  o `while` do Python — sem isso o laço não termina.

## Padrões

- Nomes de variáveis em `snake_case`, seguindo a PEP 8.
- Saída formatada com f-strings.
- Constantes de configuração (limites, senha, quantidade) em maiúsculas no início do arquivo.
- Todos os desafios foram executados e rodam sem erro, incluindo os casos de opção
  inválida, divisão por zero e senha incorreta.
