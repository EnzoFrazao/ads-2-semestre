programa
{
    /*
     * Menu de Operações Matemáticas - versão em Portugol de
     * desafio_2_menu_operacoes.py
     *
     * O Portugol não fecha o switch automaticamente como o match/case do
     * Python: cada "caso" precisa do "pare" para não cair no próximo.
     */

    funcao inicio()
    {
        inteiro opcao
        real primeiro
        real segundo

        escreva("===== MENU DE OPERAÇÕES =====\n")
        escreva("1 - Soma\n")
        escreva("2 - Subtração\n")
        escreva("3 - Multiplicação\n")
        escreva("4 - Divisão\n")
        escreva("Escolha a operação: ")
        leia(opcao)

        escreva("Digite o primeiro número: ")
        leia(primeiro)
        escreva("Digite o segundo número: ")
        leia(segundo)

        escolha (opcao)
        {
            caso 1:
                escreva("Resultado: ", primeiro + segundo, "\n")
                pare
            caso 2:
                escreva("Resultado: ", primeiro - segundo, "\n")
                pare
            caso 3:
                escreva("Resultado: ", primeiro * segundo, "\n")
                pare
            caso 4:
                se (segundo == 0.0)
                {
                    escreva("Erro: não é possível dividir por zero.\n")
                }
                senao
                {
                    escreva("Resultado: ", primeiro / segundo, "\n")
                }
                pare
            caso contrario:
                escreva("Opção inválida.\n")
        }
    }
}
