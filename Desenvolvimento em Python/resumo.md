# Trilha: Desenvolvimento em Python

Cursos: **Noções básicas de Python** (University of Michigan) + **Coleta e processamento de dados com Python** (University of Michigan).

## Primeiro programa e saída gráfica
Estrutura básica de um script Python (`print`, execução linha a linha) e uso do módulo `turtle` para desenhar na tela, como primeira forma de visualizar o que o código faz.
```python
import turtle
t = turtle.Turtle()
for _ in range(4):
    t.forward(100)
    t.right(90)  # desenha um quadrado
```

## Diagramas de referência (depuração)
Técnica de desenhar, no papel, uma caixa para cada variável com uma seta para o valor/objeto que ela referencia — usada para acompanhar o estado do programa e achar bugs antes de rodar o código.
```
x = [1, 2, 3]
y = x        # y aponta para a MESMA lista (aliasing)
y.append(4)  # x também vira [1, 2, 3, 4]
```

## Estruturas de dados sequenciais: strings, listas e tuplas
Strings e tuplas são imutáveis (qualquer "alteração" cria um objeto novo); listas são mutáveis (podem ser alteradas no lugar).
```python
s = "abc"
s2 = s.upper()      # "abc" continua existindo; s2 é um novo objeto
lista = [1, 2, 3]
lista.append(4)      # a mesma lista é alterada no lugar
tupla = (1, 2, 3)    # não pode ser alterada
```

## Iteração com `for` e padrão de acumulação
Percorrer uma sequência item a item, acumulando um resultado (soma, nova lista, contagem) em uma variável iniciada antes do loop.
```python
total = 0
for n in [10, 20, 30]:
    total += n   # acumulação
```

## Booleanos e condicionais
Tipo `bool` (`True`/`False`) e execução condicional binária, unária, aninhada ou encadeada (`if/elif/else`) para o programa tomar decisões.
```python
idade = 20
if idade < 12:
    categoria = "criança"
elif idade < 18:
    categoria = "adolescente"
else:
    categoria = "adulto"
```

## Mutação vs. criação de novo objeto
Diferença central para evitar bugs: `+=` numa lista muta a lista existente, enquanto `+` cria uma lista nova; fatiar (`slice`) uma sequência sempre cria uma cópia independente.
```python
a = [1, 2]
b = a
a += [3]        # muta a lista; b também vira [1, 2, 3]
c = a + [4]     # cria lista nova; a não muda
copia = a[:]    # cópia independente
```

## Dados aninhados (JSON) e iteração aninhada
Dados vindos da web costumam vir como JSON: dicionários e listas combinados em vários níveis. Para extrair um valor específico é preciso navegar nível por nível, e um loop dentro de outro loop (iteração aninhada) percorre estruturas aninhadas.
```python
dados = {"usuario": "Enzo", "cursos": [{"nome": "Python Basics", "nota": 95}]}
nota = dados["cursos"][0]["nota"]  # 95
for curso in dados["cursos"]:
    print(curso["nome"])
```

## `map`, `filter` e compreensão de lista
Três formas de transformar/filtrar uma sequência sem escrever um loop explícito com acumulação manual; a compreensão de lista é a forma mais usada na prática.
```python
notas = [95, 40, 88, 60]
aprovados = [n for n in notas if n >= 60]        # compreensão de lista
dobradas = list(map(lambda n: n * 2, notas))     # map
so_altas = list(filter(lambda n: n >= 80, notas))# filter
```

## Consumo de APIs REST da Internet
Uso do módulo `requests` para buscar dados de um serviço externo, interpretar a resposta como JSON e ler a documentação da API para saber quais parâmetros/endpoints existem; inclui armazenar em cache o que já foi buscado para não repetir requisições.
```python
import requests
resposta = requests.get("https://api.exemplo.com/usuarios/1")
usuario = resposta.json()
print(usuario["nome"])
```
