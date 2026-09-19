programa
{
    /*
     * Módulo estatistica (bônus) - versão em Portugol de estatistica.py
     *
     * Diferente do Python, o Portugol Studio SUPORTA apelido ao incluir
     * uma biblioteca (inclua biblioteca estatistica --> est), então o
     * "alias est" pedido no desafio é reproduzido em bonus.por.
     */

    // Retorna a média aritmética dos números do vetor.
    funcao real media(real numeros[10], inteiro tamanho)
    {
        real soma = 0.0
        inteiro i

        para (i = 0; i < tamanho; i = i + 1)
        {
            soma = soma + numeros[i]
        }

        retorne soma / tamanho
    }

    // Retorna a mediana, ordenando uma cópia do vetor (bolha) antes.
    funcao real mediana(real numeros[10], inteiro tamanho)
    {
        real ordenados[10]
        real temporario
        inteiro i
        inteiro j
        inteiro meio

        para (i = 0; i < tamanho; i = i + 1)
        {
            ordenados[i] = numeros[i]
        }

        para (i = 0; i < tamanho - 1; i = i + 1)
        {
            para (j = 0; j < tamanho - 1 - i; j = j + 1)
            {
                se (ordenados[j] > ordenados[j + 1])
                {
                    temporario = ordenados[j]
                    ordenados[j] = ordenados[j + 1]
                    ordenados[j + 1] = temporario
                }
            }
        }

        meio = tamanho / 2
        se (tamanho % 2 == 0)
        {
            retorne (ordenados[meio - 1] + ordenados[meio]) / 2.0
        }
        retorne ordenados[meio]
    }

    // Retorna a moda (valor mais frequente) supondo o vetor já ordenado.
    funcao real moda(real numeros[10], inteiro tamanho)
    {
        inteiro i
        inteiro melhor_contagem = 0
        inteiro contagem_atual
        real valor_moda = numeros[0]
        inteiro j

        para (i = 0; i < tamanho; i = i + 1)
        {
            contagem_atual = 0
            para (j = 0; j < tamanho; j = j + 1)
            {
                se (numeros[j] == numeros[i])
                {
                    contagem_atual = contagem_atual + 1
                }
            }
            se (contagem_atual > melhor_contagem)
            {
                melhor_contagem = contagem_atual
                valor_moda = numeros[i]
            }
        }

        retorne valor_moda
    }

    funcao inicio()
    {
        real notas[5] = {7.5, 8.0, 6.5, 8.0, 9.0}

        escreva("Média: ", media(notas, 5), "\n")
        escreva("Mediana: ", mediana(notas, 5), "\n")
        escreva("Moda: ", moda(notas, 5), "\n")
    }
}
