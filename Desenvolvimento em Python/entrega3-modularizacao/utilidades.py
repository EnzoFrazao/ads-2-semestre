"""Módulo utilidades: funções auxiliares da Prática Independente da Semana 03."""


def celsius_para_fahrenheit(celsius):
    """Converte uma temperatura de Celsius para Fahrenheit."""
    return celsius * 9 / 5 + 32


def validar_senha(senha):
    """Retorna True se a senha tiver 8 ou mais caracteres."""
    return len(senha) >= 8


def caixa(*precos):
    """Recebe uma quantidade variável de preços e retorna total, item mais caro e média."""
    if not precos:
        return 0.0, None, 0.0

    total = sum(precos)
    mais_caro = max(precos)
    media = total / len(precos)
    return total, mais_caro, media


def ficha_aluno(**dados):
    """Imprime uma informação do aluno por linha, a partir dos dados nomeados recebidos."""
    for chave, valor in dados.items():
        print(f"{chave}: {valor}")


if __name__ == "__main__":
    # Demonstração rápida das funções quando o módulo é executado direto.
    print(f"25°C = {celsius_para_fahrenheit(25):.1f}°F")
    print(f"Senha 'abc123' válida? {validar_senha('abc123')}")

    total, mais_caro, media = caixa(19.9, 45.0, 7.5)
    print(f"Caixa: total={total:.2f}, mais caro={mais_caro:.2f}, média={media:.2f}")

    ficha_aluno(nome="Ana", matricula=2026001, curso="ADS")
