"""Desafio 5 - Calculadora com menu.

Junta tudo: importa o módulo calculadora e deixa o usuário escolher a
operação em um menu que repete até ele pedir para sair. É aqui que o
tratamento de divisão por zero aparece na prática.
"""

import calculadora

OPCAO_SAIR = "5"
OPCOES_DE_OPERACAO = ("1", "2", "3", "4")


def mostrar_menu():
    """Imprime as opções disponíveis."""
    print("\n===== CALCULADORA =====")
    print("1 - Somar")
    print("2 - Subtrair")
    print("3 - Multiplicar")
    print("4 - Dividir")
    print("5 - Sair")


def ler_numero(rotulo):
    """Lê um número do teclado e só devolve quando o valor é válido."""
    while True:
        entrada = input(f"Digite o {rotulo} número: ")
        try:
            return float(entrada.replace(",", "."))
        except ValueError:
            print("Número inválido, tente novamente.")


def calcular(opcao, primeiro, segundo):
    """Chama no módulo calculadora a função correspondente à opção."""
    if opcao == "1":
        return calculadora.somar(primeiro, segundo)
    if opcao == "2":
        return calculadora.subtrair(primeiro, segundo)
    if opcao == "3":
        return calculadora.multiplicar(primeiro, segundo)
    return calculadora.dividir(primeiro, segundo)


def main():
    while True:
        mostrar_menu()
        opcao = input("Escolha uma opção: ").strip()

        if opcao == OPCAO_SAIR:
            print("Encerrando a calculadora. Até logo!")
            break

        if opcao not in OPCOES_DE_OPERACAO:
            print("Opção inválida: escolha um número de 1 a 5.")
            continue

        primeiro = ler_numero("primeiro")
        segundo = ler_numero("segundo")

        resultado = calcular(opcao, primeiro, segundo)

        # dividir() devolve None quando o divisor é zero.
        if resultado is None:
            print("A operação não pôde ser concluída.")
        else:
            print(f"Resultado: {resultado:.2f}")


if __name__ == "__main__":
    main()
