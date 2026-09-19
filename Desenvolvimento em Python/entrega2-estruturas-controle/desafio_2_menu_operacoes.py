"""Menu de Operações Matemáticas: executa soma, subtração, multiplicação ou divisão."""

print("===== MENU DE OPERAÇÕES =====")
print("1 - Soma")
print("2 - Subtração")
print("3 - Multiplicação")
print("4 - Divisão")

opcao = int(input("Escolha a operação: "))
primeiro = float(input("Digite o primeiro número: "))
segundo = float(input("Digite o segundo número: "))

match opcao:
    case 1:
        print(f"Resultado: {primeiro + segundo}")
    case 2:
        print(f"Resultado: {primeiro - segundo}")
    case 3:
        print(f"Resultado: {primeiro * segundo}")
    case 4:
        if segundo == 0:
            print("Erro: não é possível dividir por zero.")
        else:
            print(f"Resultado: {primeiro / segundo}")
    case _:
        print("Opção inválida.")
