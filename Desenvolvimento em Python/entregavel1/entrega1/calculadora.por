programa
{
    /*
     * Módulo calculadora - versão em Portugol de calculadora.py
     *
     * O Portugol Studio não tem "import" como o Python, então as funções
     * que no Python moram no arquivo calculadora.py aqui ficam declaradas
     * dentro do próprio programa. A ideia continua a mesma: escrever cada
     * operação uma única vez e reaproveitar.
     */

    // Retorna a soma de a e b.
    funcao real somar(real a, real b)
    {
        retorne a + b
    }

    // Retorna a diferença entre a e b.
    funcao real subtrair(real a, real b)
    {
        retorne a - b
    }

    // Retorna o produto de a e b.
    funcao real multiplicar(real a, real b)
    {
        retorne a * b
    }

    /*
     * Divide a por b tratando a divisão por zero.
     *
     * O Portugol não tem try/except, então o teste é feito com um "se"
     * ANTES de dividir - o erro é evitado em vez de capturado. No Python
     * a função devolve None nesse caso; aqui devolvemos 0.0 depois de
     * avisar o usuário, porque o Portugol exige um real de retorno.
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

    funcao inicio()
    {
        // Equivale ao bloco if __name__ == "__main__" do Python:
        // uma demonstração rápida das quatro operações.
        escreva("Demonstração do módulo calculadora\n")
        escreva("2 + 3 = ", somar(2.0, 3.0), "\n")
        escreva("10 - 4 = ", subtrair(10.0, 4.0), "\n")
        escreva("6 * 7 = ", multiplicar(6.0, 7.0), "\n")
        escreva("10 / 2 = ", dividir(10.0, 2.0), "\n")

        // Este último cai no tratamento de divisão por zero.
        escreva("10 / 0 = ", dividir(10.0, 0.0), "\n")
    }
}
