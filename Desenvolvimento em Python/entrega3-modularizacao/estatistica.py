"""Módulo estatística (bônus): média, mediana e moda de uma lista de números.

Uso recomendado em outros scripts: import estatistica as est
"""


def media(numeros):
    """Retorna a média aritmética dos números."""
    return sum(numeros) / len(numeros)


def mediana(numeros):
    """Retorna a mediana dos números."""
    ordenados = sorted(numeros)
    tamanho = len(ordenados)
    meio = tamanho // 2

    if tamanho % 2 == 0:
        return (ordenados[meio - 1] + ordenados[meio]) / 2
    return ordenados[meio]


def moda(numeros):
    """Retorna o(s) valor(es) que mais se repetem na lista."""
    contagem = {}
    for numero in numeros:
        contagem[numero] = contagem.get(numero, 0) + 1

    maior_frequencia = max(contagem.values())
    return [numero for numero, freq in contagem.items() if freq == maior_frequencia]


if __name__ == "__main__":
    notas = [7.5, 8.0, 6.5, 8.0, 9.0]
    print(f"Média: {media(notas):.2f}")
    print(f"Mediana: {mediana(notas):.2f}")
    print(f"Moda: {moda(notas)}")
