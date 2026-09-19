"""Classificador de Cliente: recebe idade e renda e classifica em Bronze, Prata, Ouro ou Diamante.

Clientes menores de idade são sempre classificados como Bronze.
"""

IDADE_MINIMA = 18
RENDA_PRATA = 2000.0
RENDA_OURO = 5000.0
RENDA_DIAMANTE = 10000.0

idade = int(input("Digite a idade do cliente: "))
renda = float(input("Digite a renda mensal do cliente: R$ "))

if idade < IDADE_MINIMA:
    categoria = "Bronze"
elif renda >= RENDA_DIAMANTE:
    categoria = "Diamante"
elif renda >= RENDA_OURO:
    categoria = "Ouro"
elif renda >= RENDA_PRATA:
    categoria = "Prata"
else:
    categoria = "Bronze"

print(f"Cliente classificado como: {categoria}")
