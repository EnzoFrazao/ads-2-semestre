LIVRE = 0
PAREDE = 1
TRILHA = "."
SAIDA = "S"

labirinto = [
    [0, 0, 1, 0, 0],
    [1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, "S"],
]


def imprimir_labirinto(labirinto):
    for linha in labirinto:
        print(" ".join(str(celula) for celula in linha))
    print()


def eh_valido(labirinto, linha, coluna):
    dentro_das_linhas = 0 <= linha < len(labirinto)
    dentro_das_colunas = 0 <= coluna < len(labirinto[0])
    if not (dentro_das_linhas and dentro_das_colunas):
        return False
    return labirinto[linha][coluna] in (LIVRE, SAIDA)


def resolver_labirinto(labirinto, linha, coluna, caminho, passo=1):
    if labirinto[linha][coluna] == SAIDA:
        caminho.append((linha, coluna))
        return True

    valor_original = labirinto[linha][coluna]
    labirinto[linha][coluna] = TRILHA
    caminho.append((linha, coluna))

    print(f"Passo {passo}: posição atual ({linha}, {coluna})")
    imprimir_labirinto(labirinto)

    for prox_linha, prox_coluna in ((linha + 1, coluna), (linha, coluna + 1)):
        if eh_valido(labirinto, prox_linha, prox_coluna):
            if resolver_labirinto(labirinto, prox_linha, prox_coluna, caminho, passo + 1):
                return True

    labirinto[linha][coluna] = valor_original
    caminho.pop()
    return False


if __name__ == "__main__":
    print("Labirinto inicial:")
    imprimir_labirinto(labirinto)

    caminho = []
    if resolver_labirinto(labirinto, 0, 0, caminho):
        print("Labirinto final:")
        imprimir_labirinto(labirinto)
        print(f"Caminho até a saída: {caminho}")
        print(f"Total de passos: {len(caminho) - 1}")
    else:
        print("Não foi possível encontrar um caminho até a saída.")
