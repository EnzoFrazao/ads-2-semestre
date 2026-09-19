programa
{
    /*
     * Desafios bônus - versão em Portugol de bonus.py
     *
     * O apelido "est" é criado ao incluir a biblioteca, algo que o
     * Portugol Studio suporta e o Python também (import ... as est).
     * relatorio() não tem *linhas/**config em Portugol: usamos um
     * vetor + tamanho para as linhas e parâmetros fixos para a largura.
     */
    inclua biblioteca estatistica --> est

    // Fatorial recursivo - mesma lógica do fatorial() em bonus.py.
    funcao inteiro fatorial(inteiro n)
    {
        se (n <= 1)
        {
            retorne 1
        }
        retorne n * fatorial(n - 1)
    }

    // Fatorial iterativo, para comparação com a versão recursiva.
    funcao inteiro fatorial_iterativo(inteiro n)
    {
        inteiro resultado = 1
        inteiro i

        para (i = 2; i <= n; i = i + 1)
        {
            resultado = resultado * i
        }
        retorne resultado
    }

    funcao vazio relatorio(cadeia titulo, cadeia linhas[10], inteiro qtd_linhas, inteiro largura)
    {
        inteiro i

        escreva(titulo, "\n")
        para (i = 0; i < largura; i = i + 1)
        {
            escreva("-")
        }
        escreva("\n")

        para (i = 0; i < qtd_linhas; i = i + 1)
        {
            escreva(linhas[i], "\n")
        }
    }

    funcao inicio()
    {
        real notas[5] = {7.5, 8.0, 6.5, 8.0, 9.0}
        cadeia linhas[2]

        escreva("Média: ", est.media(notas, 5), "\n")
        escreva("Mediana: ", est.mediana(notas, 5), "\n")

        escreva("\nFatorial de 5 (recursivo): ", fatorial(5), "\n")
        escreva("Fatorial de 5 (iterativo): ", fatorial_iterativo(5), "\n")

        escreva("\n")
        linhas[0] = "Média: ver acima"
        linhas[1] = "Mediana: ver acima"
        relatorio("Relatorio de Notas", linhas, 2, 30)
    }
}
