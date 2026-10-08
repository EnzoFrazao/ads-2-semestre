programa
{
    /*
     * Sistema de Produtos - versão em Portugol de
     * sistema_produtos.py
     *
     * Em vez de list()/set()/tuple() dinâmicos, usamos vetores de tamanho
     * fixo, laços manuais para ordenar (bolha) e comparações manuais para
     * simular um conjunto de categorias únicas.
     */

    inteiro TAMANHO_MAXIMO = 10

    cadeia nomes[TAMANHO_MAXIMO]
    real precos[TAMANHO_MAXIMO]
    cadeia categorias[TAMANHO_MAXIMO]
    inteiro quantidade

    cadeia categorias_unicas[TAMANHO_MAXIMO]
    inteiro total_categorias_unicas

    funcao inicio()
    {
        inteiro i, j
        real valor_referencia, soma, menor_preco, maior_preco, preco_medio
        cadeia filtro
        logico ja_existe

        escreva("Quantos produtos deseja cadastrar? ")
        leia(quantidade)

        para (i = 0; i < quantidade; i++)
        {
            escreva("\nProduto ", i + 1, ":\n")
            escreva("  Nome: ")
            leia(nomes[i])
            escreva("  Preco: ")
            leia(precos[i])
            escreva("  Categoria: ")
            leia(categorias[i])
        }

        escreva("\nDigite um valor de preco para filtrar: ")
        leia(valor_referencia)
        escreva("Filtrar produtos acima (A) ou abaixo (B) desse valor? ")
        leia(filtro)

        escreva("\nProdutos filtrados:\n")
        para (i = 0; i < quantidade; i++)
        {
            se (filtro == "A" e precos[i] > valor_referencia)
            {
                escreva("  ", nomes[i], " | R$ ", precos[i], "\n")
            }
            senao se (filtro == "B" e precos[i] < valor_referencia)
            {
                escreva("  ", nomes[i], " | R$ ", precos[i], "\n")
            }
        }

        // Ordenação pelo método da bolha (bubble sort), crescente.
        para (i = 0; i < quantidade - 1; i++)
        {
            para (j = 0; j < quantidade - i - 1; j++)
            {
                se (precos[j] > precos[j + 1])
                {
                    real preco_temporario
                    cadeia nome_temporario

                    preco_temporario = precos[j]
                    precos[j] = precos[j + 1]
                    precos[j + 1] = preco_temporario

                    nome_temporario = nomes[j]
                    nomes[j] = nomes[j + 1]
                    nomes[j + 1] = nome_temporario
                }
            }
        }

        escreva("\nOrdenados por preco crescente:\n")
        para (i = 0; i < quantidade; i++)
        {
            escreva("  ", nomes[i], " | R$ ", precos[i], "\n")
        }

        escreva("\nOrdenados por preco decrescente:\n")
        para (i = quantidade - 1; i >= 0; i--)
        {
            escreva("  ", nomes[i], " | R$ ", precos[i], "\n")
        }

        // Simulação manual de um conjunto: cada categoria só entra uma vez,
        // comparando com as que já foram guardadas antes de adicionar.
        total_categorias_unicas = 0
        para (i = 0; i < quantidade; i++)
        {
            ja_existe = falso
            para (j = 0; j < total_categorias_unicas; j++)
            {
                se (categorias_unicas[j] == categorias[i])
                {
                    ja_existe = verdadeiro
                }
            }
            se (ja_existe == falso)
            {
                categorias_unicas[total_categorias_unicas] = categorias[i]
                total_categorias_unicas++
            }
        }

        escreva("\nCategorias unicas: ")
        para (i = 0; i < total_categorias_unicas; i++)
        {
            escreva(categorias_unicas[i])
            se (i < total_categorias_unicas - 1)
            {
                escreva(", ")
            }
        }
        escreva("\n")

        // Estatísticas calculadas manualmente (equivalente à tupla imutável).
        menor_preco = precos[0]
        maior_preco = precos[0]
        soma = 0
        para (i = 0; i < quantidade; i++)
        {
            se (precos[i] < menor_preco)
            {
                menor_preco = precos[i]
            }
            se (precos[i] > maior_preco)
            {
                maior_preco = precos[i]
            }
            soma = soma + precos[i]
        }
        preco_medio = soma / quantidade

        escreva("\nEstatisticas de preco:\n")
        escreva("  Menor preco: R$ ", menor_preco, "\n")
        escreva("  Maior preco: R$ ", maior_preco, "\n")
        escreva("  Preco medio: R$ ", preco_medio, "\n")
    }
}
