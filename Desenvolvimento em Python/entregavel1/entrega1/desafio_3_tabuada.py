"""Desafio 3 - Tabuada.

Mostra a tabuada de 1 a 10 do número escolhido pelo usuário, usando a
função multiplicar do módulo calculadora.
"""

import calculadora

ULTIMO_MULTIPLICADOR = 10


def main():
    entrada = input("Digite um número para ver a tabuada: ")

    try:
        numero = int(entrada)
    except ValueError:
        print("Entrada inválida: digite apenas números inteiros.")
        return

    print(f"\nTabuada do {numero}:")
    for multiplicador in range(1, ULTIMO_MULTIPLICADOR + 1):
        resultado = calculadora.multiplicar(numero, multiplicador)
        print(f"{numero} x {multiplicador} = {resultado}")


if __name__ == "__main__":
    main()
