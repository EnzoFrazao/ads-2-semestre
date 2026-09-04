"""Desafio 1 - Par ou ímpar.

Lê um número inteiro e informa se ele é par ou ímpar.
"""


def eh_par(numero):
    """Retorna True quando o número é par.

    O resto da divisão por 2 (operador %) é zero em todo número par.
    """
    return numero % 2 == 0


def main():
    entrada = input("Digite um número inteiro: ")

    try:
        numero = int(entrada)
    except ValueError:
        print("Entrada inválida: digite apenas números inteiros.")
        return

    if eh_par(numero):
        print(f"O número {numero} é PAR.")
    else:
        print(f"O número {numero} é ÍMPAR.")


if __name__ == "__main__":
    main()
