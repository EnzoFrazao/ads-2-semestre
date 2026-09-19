"""Script principal: importa calculadora e utilidades, demonstrando o reaproveitamento de código."""

from calculadora import somar, subtrair, multiplicar, dividir
from utilidades import celsius_para_fahrenheit, validar_senha, caixa, ficha_aluno


def adicionar_item_seguro(lista, item):
    """Adiciona um item a uma cópia da lista, sem alterar a lista original."""
    nova_lista = lista[:]
    nova_lista.append(item)
    return nova_lista


def main():
    print("=== Módulo calculadora ===")
    print(f"5 + 3 = {somar(5, 3)}")
    print(f"5 - 3 = {subtrair(5, 3)}")
    print(f"5 * 3 = {multiplicar(5, 3)}")
    print(f"5 / 0 = {dividir(5, 0)}")

    print("\n=== Módulo utilidades ===")
    print(f"25°C = {celsius_para_fahrenheit(25):.1f}°F")
    print(f"Senha 'abc123' válida? {validar_senha('abc123')}")
    print(f"Senha 'senha1234' válida? {validar_senha('senha1234')}")

    total, mais_caro, media = caixa(19.9, 45.0, 7.5)
    print(f"Caixa: total={total:.2f}, mais caro={mais_caro:.2f}, média={media:.2f}")

    ficha_aluno(nome="Ana", matricula=2026001, curso="ADS")

    print("\n=== Lista segura ===")
    compras = ["arroz", "feijão"]
    novas_compras = adicionar_item_seguro(compras, "café")
    print(f"Original: {compras}")
    print(f"Nova lista: {novas_compras}")


if __name__ == "__main__":
    main()
