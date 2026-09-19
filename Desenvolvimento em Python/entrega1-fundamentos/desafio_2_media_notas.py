"""Média de notas: lê 3 notas via input() e calcula a média com 2 casas decimais."""

nota1 = float(input("Digite a primeira nota: "))
nota2 = float(input("Digite a segunda nota: "))
nota3 = float(input("Digite a terceira nota: "))

media = (nota1 + nota2 + nota3) / 3

print(f"Média: {media:.2f}")
