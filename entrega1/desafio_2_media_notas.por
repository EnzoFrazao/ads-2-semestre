programa
{
    /*
     * Desafio 2 - Média de notas
     * Versão em Portugol de desafio_2_media_notas.py
     *
     * Lê três notas, soma e divide usando as mesmas funções do módulo
     * calculadora. Como não existe import no Portugol, somar e dividir
     * estão copiadas aqui dentro.
     */

    // Constantes do Python viram variáveis fixas aqui.
    inteiro QUANTIDADE_DE_NOTAS = 3
    real MEDIA_PARA_APROVACAO = 7.0

    funcao real somar(real a, real b)
    {
        retorne a + b
    }

    funcao real dividir(real a, real b)
    {
        se (b == 0.0)
        {
            escreva("Erro: não é possível dividir por zero.\n")
            retorne 0.0
        }

        retorne a / b
    }

    funcao inicio()
    {
        real soma = 0.0
        real nota
        real media

        // Equivale ao for com range(1, QUANTIDADE_DE_NOTAS + 1) do Python.
        para (inteiro posicao = 1; posicao <= QUANTIDADE_DE_NOTAS; posicao++)
        {
            escreva("Digite a ", posicao, "a nota: ")
            leia(nota)
            soma = somar(soma, nota)
        }

        media = dividir(soma, QUANTIDADE_DE_NOTAS)

        escreva("\nSoma das notas: ", soma, "\n")
        escreva("Média final: ", media, "\n")

        se (media >= MEDIA_PARA_APROVACAO)
        {
            escreva("Situação: APROVADO\n")
        }
        senao
        {
            escreva("Situação: REPROVADO\n")
        }
    }
}
