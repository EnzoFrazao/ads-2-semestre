# Entrega 5 — Arquivos, Regex e Exceções

Sistema que lê um arquivo CSV de cadastros, valida cada campo com expressões
regulares e trata os erros mais comuns de leitura/validação.

## Arquivos

- `analisador_dados.py` — script principal.
- `dados.csv` — arquivo de entrada com registros válidos e inválidos.
- `dados_malformado.csv` — arquivo sem a coluna `idade`, usado para demonstrar
  o tratamento de `KeyError`.

## Validações aplicadas (regex)

| Campo             | Padrão                          | Justificativa                                                        |
|-------------------|----------------------------------|------------------------------------------------------------------------|
| E-mail            | `^[\w\.-]+@[\w\.-]+\.\w+$`      | Exige usuário, `@`, domínio e uma extensão (`.com`, `.com.br` etc.). |
| CPF               | `^\d{3}\.\d{3}\.\d{3}-\d{2}$`   | Formato oficial com pontos e hífen (`123.456.789-00`).                |
| Telefone          | `^\(\d{2}\)\s?\d{4,5}-\d{4}$`   | DDD entre parênteses + 4 ou 5 dígitos (fixo/celular) + hífen + 4 dígitos. |
| Data de nascimento| `^\d{2}/\d{2}/\d{4}$`           | Formato `dd/mm/aaaa`, separado por barras.                            |

## Exceções tratadas

- **`FormatoInvalidoError`** (personalizada, herda de `Exception`): levantada
  por `validar_campo` sempre que um campo não casa com o padrão regex
  esperado (e-mail, CPF, telefone ou data).
- **`ValueError`**: levantado por `int(registro["idade"])` quando a idade não
  é um número (ex.: `"abc"`), ou manualmente se a idade vier negativa.
- **`KeyError`**: levantado ao acessar `registro["idade"]` quando o CSV não
  tem essa coluna no cabeçalho (ver `dados_malformado.csv`).
- **`FileNotFoundError`**: levantado por `open()` quando o caminho do arquivo
  não existe; o script captura e segue em vez de travar.
- O bloco `finally` sempre imprime que a tentativa de leitura daquele arquivo
  terminou, independente de ter dado erro ou não.

## Exemplo de entrada (`dados.csv`)

```csv
nome,email,cpf,telefone,data_nascimento,idade
Ana Silva,ana.silva@email.com,123.456.789-00,(11) 91234-5678,15/03/1990,34
Bruno Costa,bruno@com,124.555.666-11,(21) 3456-7890,20/07/1985,39
```

## Exemplo de saída

```
===== RELATÓRIO: dados.csv =====
Total de registros: 5
Registros válidos (1):
  Ana Silva | ana.silva@email.com | idade 34
Registros inválidos (4):
  Linha 2: E-mail inválido: 'bruno@com'
  Linha 3: CPF inválido: '12345678900'
  Linha 4: Idade inválida: invalid literal for int() with base 10: 'abc'
  Linha 5: Data de nascimento inválido: '2000/05/20'
```

## Como executar

```bash
python analisador_dados.py
```
