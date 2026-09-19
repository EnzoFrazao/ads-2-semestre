"""Módulo calculadora: operações matemáticas básicas reaproveitáveis por outros scripts."""


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
    """Divide a por b, tratando a divisão por zero sem quebrar o programa."""
    if b == 0:
        print("Erro: não é possível dividir por zero.")
        return None
    return a / b


if __name__ == "__main__":
    # Demonstração rápida das quatro operações quando o módulo é executado
    # diretamente. Não roda quando o módulo é importado por outro script.
    print("Demonstração do módulo calculadora")
    print(f"2 + 3 = {somar(2, 3)}")
    print(f"10 - 4 = {subtrair(10, 4)}")
    print(f"6 * 7 = {multiplicar(6, 7)}")
    print(f"10 / 2 = {dividir(10, 2)}")
    print(f"10 / 0 = {dividir(10, 0)}")
