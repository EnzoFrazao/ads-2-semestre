programa
{
    /*
     * Desafio 4 - Maior de três números
     * Versão em Portugol de desafio_4_maior_de_tres.py
     *
     * Lê três números e informa qual é o maior. A comparação é feita na
     * mão, com "se", em vez de usar uma função pronta.
     */

    /*
     * Equivale à função maior_de_tres() do Python.
     * Começa supondo que o primeiro é o maior e troca sempre que
     * encontra um valor maior que o guardado.
     */
    funcao real maior_de_tres(real a, real b, real c)
    {
        real maior = a

        se (b > maior)
        {
            maior = b
        }

        se (c > maior)
        {
            maior = c
        }

        retorne maior
    }

    funcao inicio()
    {
        real primeiro
        real segundo
        real terceiro

        escreva("Digite o primeiro número: ")
        leia(primeiro)

        escreva("Digite o segundo número: ")
        leia(segundo)

        escreva("Digite o terceiro número: ")
        leia(terceiro)

        escreva("\nO maior número digitado é ", maior_de_tres(primeiro, segundo, terceiro), "\n")
    }
}
