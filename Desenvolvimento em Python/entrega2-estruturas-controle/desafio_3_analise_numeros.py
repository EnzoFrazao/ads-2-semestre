"""Análise de Números: lê 5 números via input() e calcula soma, média, maior e menor valor."""

QUANTIDADE = 5

numeros = []
for i in range(QUANTIDADE):
    numero = float(input(f"Digite o número {i + 1}: "))
    numeros.append(numero)

soma = sum(numeros)
media = soma / QUANTIDADE
maior = numeros[0]
menor = numeros[0]

for numero in numeros:
    if numero > maior:
        maior = numero
    if numero < menor:
        menor = numero

print(f"Soma: {soma:.2f}")
print(f"Média: {media:.2f}")
print(f"Maior: {maior:.2f}")
print(f"Menor: {menor:.2f}")
