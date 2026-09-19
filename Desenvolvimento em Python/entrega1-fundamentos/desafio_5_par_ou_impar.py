"""Par ou ímpar: recebe um número inteiro e informa se ele é par ou ímpar."""

numero = int(input("Digite um número inteiro: "))

if numero % 2 == 0:
    print(f"{numero} é par")
else:
    print(f"{numero} é ímpar")
