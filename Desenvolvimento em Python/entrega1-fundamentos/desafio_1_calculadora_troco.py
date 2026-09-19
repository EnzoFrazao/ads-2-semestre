"""Calculadora de troco: recebe o valor da compra e o valor pago e calcula o troco."""

valor_compra = float(input("Valor da compra: R$ "))
valor_pago = float(input("Valor pago: R$ "))

troco = valor_pago - valor_compra

print(f"Troco: R$ {troco:.2f}")
