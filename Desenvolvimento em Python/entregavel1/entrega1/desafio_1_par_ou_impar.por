programa
{
    /*
     * Desafio 1 - Par ou ímpar
     * Versão em Portugol de desafio_1_par_ou_impar.py
     *
     * Lê um número inteiro e informa se ele é par ou ímpar.
     */

    // Equivale à função eh_par() do Python.
    // O resto da divisão por 2 é zero em todo número par.
    funcao logico eh_par(inteiro numero)
    {
        retorne numero % 2 == 0
    }

    funcao inicio()
    {
        inteiro numero

        escreva("Digite um número inteiro: ")
        leia(numero)

        // No Python a entrada inválida é tratada com try/except no int().
        // O Portugol Studio já recusa sozinho o que não for inteiro.
        se (eh_par(numero))
        {
            escreva("O número ", numero, " é PAR.\n")
        }
        senao
        {
            escreva("O número ", numero, " é ÍMPAR.\n")
        }
    }
}
