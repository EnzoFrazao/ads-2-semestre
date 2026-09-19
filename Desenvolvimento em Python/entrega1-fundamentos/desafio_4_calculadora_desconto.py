"""Calculadora de desconto: recebe o preço de um produto e o percentual de desconto."""

preco = float(input("Preço do produto: R$ "))
percentual_desconto = float(input("Percentual de desconto (%): "))

desconto = preco * (percentual_desconto / 100)
preco_final = preco - desconto

print(f"Desconto: R$ {desconto:.2f}")
print(f"Preço final: R$ {preco_final:.2f}")
