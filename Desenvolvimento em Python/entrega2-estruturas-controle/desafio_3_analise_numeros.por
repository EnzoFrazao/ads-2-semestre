programa
{
    /*
     * Análise de Números - versão em Portugol de
     * desafio_3_analise_numeros.py
     *
     * O "para" do Portugol precisa de inicialização, condição e
     * incremento explícitos, ao contrário do "for i in range(5)".
     */

    funcao inicio()
    {
        inteiro QUANTIDADE = 5
        real numeros[5]
        real soma = 0.0
        real maior
        real menor
        inteiro i

        para (i = 0; i < QUANTIDADE; i = i + 1)
        {
            escreva("Digite o número ", i + 1, ": ")
            leia(numeros[i])
            soma = soma + numeros[i]
        }

        maior = numeros[0]
        menor = numeros[0]

        para (i = 0; i < QUANTIDADE; i = i + 1)
        {
            se (numeros[i] > maior)
            {
                maior = numeros[i]
            }
            se (numeros[i] < menor)
            {
                menor = numeros[i]
            }
        }

        escreva("Soma: ", soma, "\n")
        escreva("Média: ", soma / QUANTIDADE, "\n")
        escreva("Maior: ", maior, "\n")
        escreva("Menor: ", menor, "\n")
    }
}
