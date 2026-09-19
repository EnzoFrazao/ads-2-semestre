programa
{
    /*
     * Script Principal - versão em Portugol de script_principal.py
     *
     * O Portugol Studio não tem "import": as funções que no Python vêm
     * de calculadora.py e utilidades.py aqui ficam declaradas dentro do
     * próprio programa (mesma ideia de calculadora.por e utilidades.por).
     * A "Lista Segura" é reproduzida copiando o vetor antes de alterar.
     */

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

    funcao real dividir(real a, real b)
    {
        se (b == 0.0)
        {
            escreva("Erro: não é possível dividir por zero.\n")
            retorne 0.0
        }
        retorne a / b
    }

    funcao real celsius_para_fahrenheit(real celsius)
    {
        retorne celsius * 9.0 / 5.0 + 32.0
    }

    funcao logico validar_senha(cadeia senha)
    {
        retorne comprimento(senha) >= 8
    }

    /*
     * Copia o vetor original para um novo vetor e adiciona o item no
     * final - equivale ao "lista[:]" do Python (cópia defensiva).
     */
    funcao vazio adicionar_item_seguro(cadeia original[10], inteiro tamanho, cadeia item, cadeia copia[10])
    {
        inteiro i

        para (i = 0; i < tamanho; i = i + 1)
        {
            copia[i] = original[i]
        }
        copia[tamanho] = item
    }

    funcao inicio()
    {
        cadeia compras[10] = {"arroz", "feijao"}
        cadeia novas_compras[10]
        inteiro i

        escreva("=== Modulo calculadora ===\n")
        escreva("5 + 3 = ", somar(5.0, 3.0), "\n")
        escreva("5 - 3 = ", subtrair(5.0, 3.0), "\n")
        escreva("5 * 3 = ", multiplicar(5.0, 3.0), "\n")
        escreva("5 / 0 = ", dividir(5.0, 0.0), "\n")

        escreva("\n=== Modulo utilidades ===\n")
        escreva("25 C = ", celsius_para_fahrenheit(25.0), " F\n")
        escreva("Senha 'abc123' valida? ", validar_senha("abc123"), "\n")

        escreva("\n=== Lista segura ===\n")
        adicionar_item_seguro(compras, 2, "cafe", novas_compras)

        escreva("Original: ")
        para (i = 0; i < 2; i = i + 1)
        {
            escreva(compras[i], " ")
        }
        escreva("\n")

        escreva("Nova lista: ")
        para (i = 0; i < 3; i = i + 1)
        {
            escreva(novas_compras[i], " ")
        }
        escreva("\n")
    }
}
