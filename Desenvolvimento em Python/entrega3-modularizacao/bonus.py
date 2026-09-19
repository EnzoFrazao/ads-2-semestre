"""Desafios bônus: módulo estatistica (alias est), fatorial recursivo e relatório formatado."""

import estatistica as est


def fatorial(n):
    """Calcula o fatorial de n recursivamente."""
    if n <= 1:
        return 1
    return n * fatorial(n - 1)


def relatorio(titulo, *linhas, **config):
    """Formata um relatório de texto a partir de um título, linhas e opções de configuração."""
    largura = config.get("largura", 40)
    separador = config.get("separador", "-") * largura

    texto = [titulo.center(largura), separador]
    texto.extend(linhas)

    return "\n".join(texto)


def main():
    notas = [7.5, 8.0, 6.5, 8.0, 9.0]
    print(f"Média: {est.media(notas):.2f}")
    print(f"Mediana: {est.mediana(notas):.2f}")
    print(f"Moda: {est.moda(notas)}")

    print(f"\nFatorial de 5: {fatorial(5)}")

    print()
    print(relatorio(
        "Relatório de Notas",
        f"Média: {est.media(notas):.2f}",
        f"Mediana: {est.mediana(notas):.2f}",
        largura=30,
    ))


if __name__ == "__main__":
    main()
