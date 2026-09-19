programa
{
    /*
     * Desafio 5 - Calculadora com menu
     * Versão em Portugol de desafio_5_calculadora_menu.py
     *
     * Menu que repete até o usuário escolher sair. É aqui que o
     * tratamento de divisão por zero aparece na prática.
     */

    inteiro OPCAO_SAIR = 5

    funcao real somar(real a, real b)
    {
        retorne a + b
    }

    funcao real subtrair(real a, real b)
    {
        retorne a - b
    }

    funcao real multiplicar(real a, real b)
    {
        retorne a * b
    }

    /*
     * Divide tratando a divisão por zero.
     * O Portugol não tem try/except: o teste é feito com "se" antes de
     * dividir, evitando o erro em vez de capturá-lo.
     */
    funcao real dividir(real a, real b)
    {
        se (b == 0.0)
        {
            escreva("Erro: não é possível dividir por zero.\n")
            retorne 0.0
        }

        retorne a / b
    }

    funcao vazio mostrar_menu()
    {
        escreva("\n===== CALCULADORA =====\n")
        escreva("1 - Somar\n")
        escreva("2 - Subtrair\n")
        escreva("3 - Multiplicar\n")
        escreva("4 - Dividir\n")
        escreva("5 - Sair\n")
    }

    funcao inicio()
    {
        inteiro opcao
        real primeiro
        real segundo

        // Equivale ao while True do Python, com "pare" no lugar do break.
        enquanto (verdadeiro)
        {
            mostrar_menu()
            escreva("Escolha uma opção: ")
            leia(opcao)

            se (opcao == OPCAO_SAIR)
            {
                escreva("Encerrando a calculadora. Até logo!\n")
                pare
            }

            se (opcao < 1 ou opcao > 5)
            {
                escreva("Opção inválida: escolha um número de 1 a 5.\n")
                continue
            }

            escreva("Digite o primeiro número: ")
            leia(primeiro)

            escreva("Digite o segundo número: ")
            leia(segundo)

            escolha (opcao)
            {
                caso 1:
                    escreva("Resultado: ", somar(primeiro, segundo), "\n")
                    pare
                caso 2:
                    escreva("Resultado: ", subtrair(primeiro, segundo), "\n")
                    pare
                caso 3:
                    escreva("Resultado: ", multiplicar(primeiro, segundo), "\n")
                    pare
                caso 4:
                    // Quando o segundo número é zero, dividir() avisa o erro.
                    se (segundo != 0.0)
                    {
                        escreva("Resultado: ", dividir(primeiro, segundo), "\n")
                    }
                    senao
                    {
                        dividir(primeiro, segundo)
                        escreva("A operação não pôde ser concluída.\n")
                    }
                    pare
            }
        }
    }
}
