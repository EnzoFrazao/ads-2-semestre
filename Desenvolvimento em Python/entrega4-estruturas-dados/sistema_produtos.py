def cadastrar_produtos(quantidade):
    produtos = []
    for numero in range(1, quantidade + 1):
        print(f"\nProduto {numero}:")
        nome = input("  Nome: ")
        preco = float(input("  Preço: "))
        categoria = input("  Categoria: ")
        produtos.append({"nome": nome, "preco": preco, "categoria": categoria})
    return produtos


def filtrar_por_preco(produtos, valor, acima=True):
    if acima:
        return [produto for produto in produtos if produto["preco"] > valor]
    return [produto for produto in produtos if produto["preco"] < valor]


def ordenar_por_preco_crescente(produtos):
    produtos_ordenados = list(produtos)
    produtos_ordenados.sort(key=lambda produto: produto["preco"])
    return produtos_ordenados


def ordenar_por_preco_decrescente(produtos):
    return sorted(produtos, key=lambda produto: produto["preco"], reverse=True)


def categorias_unicas(produtos):
    return {produto["categoria"] for produto in produtos}


def estatisticas_de_preco(produtos):
    precos = [produto["preco"] for produto in produtos]
    menor_preco = min(precos)
    maior_preco = max(precos)
    preco_medio = sum(precos) / len(precos)
    return (menor_preco, maior_preco, preco_medio)


def imprimir_relatorio(produtos, filtrados, crescente, decrescente, categorias, estatisticas):
    menor_preco, maior_preco, preco_medio = estatisticas

    print("\n===== RELATÓRIO FINAL =====")

    print("\nProdutos cadastrados:")
    for produto in produtos:
        print(f"  {produto['nome']} | R$ {produto['preco']:.2f} | {produto['categoria']}")

    print(f"\nProdutos filtrados ({len(filtrados)} encontrados):")
    for produto in filtrados:
        print(f"  {produto['nome']} | R$ {produto['preco']:.2f}")

    print("\nOrdenados por preço crescente:")
    for produto in crescente:
        print(f"  {produto['nome']} | R$ {produto['preco']:.2f}")

    print("\nOrdenados por preço decrescente:")
    for produto in decrescente:
        print(f"  {produto['nome']} | R$ {produto['preco']:.2f}")

    print(f"\nCategorias únicas: {', '.join(categorias)}")

    print("\nEstatísticas de preço:")
    print(f"  Menor preço: R$ {menor_preco:.2f}")
    print(f"  Maior preço: R$ {maior_preco:.2f}")
    print(f"  Preço médio: R$ {preco_medio:.2f}")


if __name__ == "__main__":
    quantidade_produtos = int(input("Quantos produtos deseja cadastrar? "))
    produtos = cadastrar_produtos(quantidade_produtos)

    valor_referencia = float(input("\nDigite um valor de preço para filtrar: "))
    filtro_acima = input("Filtrar produtos acima (A) ou abaixo (B) desse valor? ").strip().upper() == "A"
    produtos_filtrados = filtrar_por_preco(produtos, valor_referencia, acima=filtro_acima)

    produtos_crescente = ordenar_por_preco_crescente(produtos)
    produtos_decrescente = ordenar_por_preco_decrescente(produtos)
    categorias = categorias_unicas(produtos)
    estatisticas = estatisticas_de_preco(produtos)

    imprimir_relatorio(
        produtos, produtos_filtrados, produtos_crescente, produtos_decrescente, categorias, estatisticas
    )
