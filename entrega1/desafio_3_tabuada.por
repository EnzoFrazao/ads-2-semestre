programa
{
    /*
     * Desafio 3 - Tabuada
     * Versão em Portugol de desafio_3_tabuada.py
     *
     * Mostra a tabuada de 1 a 10 do número escolhido, usando a mesma
     * função multiplicar que no Python vem do módulo calculadora.
     */

    inteiro ULTIMO_MULTIPLICADOR = 10

    // Equivale a calculadora.multiplicar().
    funcao real multiplicar(real a, real b)
    {
        retorne a * b
    }

    funcao inicio()
    {
        inteiro numero

        escreva("Digite um número para ver a tabuada: ")
        leia(numero)

        escreva("\nTabuada do ", numero, ":\n")

        // Mesmo laço do for com range() no Python.
        para (inteiro multiplicador = 1; multiplicador <= ULTIMO_MULTIPLICADOR; multiplicador++)
        {
            escreva(numero, " x ", multiplicador, " = ", multiplicar(numero, multiplicador), "\n")
        }
    }
}
