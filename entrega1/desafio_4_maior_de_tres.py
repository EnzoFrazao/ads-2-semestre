"""Desafio 4 - Maior de três números.

Lê três números e informa qual é o maior. A comparação é feita na mão,
com if, para exercitar a lógica em vez de chamar a função pronta max().
"""


def ler_numero(rotulo):
    """Lê um número do teclado e só devolve quando o valor é válido."""
    while True:
        entrada = input(f"Digite o {rotulo} número: ")
        try:
            return float(entrada.replace(",", "."))
        except ValueError:
            print("Número inválido, tente novamente.")


def maior_de_tres(a, b, c):
    """Retorna o maior entre os três valores recebidos.

    Começa supondo que o primeiro é o maior e troca sempre que encontra
    um valor maior que o guardado.
    """
    maior = a
    if b > maior:
        maior = b
    if c > maior:
        maior = c
    return maior


def main():
    primeiro = ler_numero("primeiro")
    segundo = ler_numero("segundo")
    terceiro = ler_numero("terceiro")

    maior = maior_de_tres(primeiro, segundo, terceiro)
    print(f"\nO maior número digitado é {maior:.2f}")


if __name__ == "__main__":
    main()
