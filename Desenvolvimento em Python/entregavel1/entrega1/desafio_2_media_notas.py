"""Desafio 2 - Média de notas.

Lê três notas e calcula a média usando as funções somar e dividir
importadas do módulo calculadora.
"""

import calculadora

QUANTIDADE_DE_NOTAS = 3
MEDIA_PARA_APROVACAO = 7.0


def ler_nota(posicao):
    """Lê uma nota do teclado e só devolve quando o valor é válido."""
    while True:
        entrada = input(f"Digite a {posicao}ª nota: ")
        try:
            # Aceita tanto 7.5 quanto 7,5.
            return float(entrada.replace(",", "."))
        except ValueError:
            print("Nota inválida: use números, por exemplo 7.5")


def main():
    soma = 0.0
    for posicao in range(1, QUANTIDADE_DE_NOTAS + 1):
        soma = calculadora.somar(soma, ler_nota(posicao))

    media = calculadora.dividir(soma, QUANTIDADE_DE_NOTAS)

    print(f"\nSoma das notas: {soma:.2f}")
    print(f"Média final: {media:.2f}")

    if media >= MEDIA_PARA_APROVACAO:
        print("Situação: APROVADO")
    else:
        print("Situação: REPROVADO")


if __name__ == "__main__":
    main()
