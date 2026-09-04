"""Módulo calculadora.

Reúne as quatro operações básicas em um único lugar para que os desafios
desta entrega possam importá-las em vez de reescrever a mesma conta.

A função dividir trata a divisão por zero: em vez de deixar o programa
quebrar com ZeroDivisionError, ela avisa o usuário e devolve None.
"""


def somar(a, b):
    """Retorna a soma de a e b."""
    return a + b


def subtrair(a, b):
    """Retorna a diferença entre a e b."""
    return a - b


def multiplicar(a, b):
    """Retorna o produto de a e b."""
    return a * b


def dividir(a, b):
    """Retorna a divisão de a por b.

    Dividir por zero é impossível na matemática e o Python levanta
    ZeroDivisionError quando isso acontece. Aqui o erro é capturado com
    try/except, o usuário recebe uma mensagem clara e a função devolve
    None, deixando para quem chamou decidir o que fazer.
    """
    try:
        return a / b
    except ZeroDivisionError:
        print("Erro: não é possível dividir por zero.")
        return None


# Este bloco só roda quando o arquivo é executado direto,
# ou seja, com o comando: python calculadora.py
# Quando ele é importado por outro arquivo, nada aqui dentro é executado.
if __name__ == "__main__":
    print("Demonstração do módulo calculadora")
    print("2 + 3 =", somar(2, 3))
    print("10 - 4 =", subtrair(10, 4))
    print("6 * 7 =", multiplicar(6, 7))
    print("10 / 2 =", dividir(10, 2))
    print("10 / 0 =", dividir(10, 0))
