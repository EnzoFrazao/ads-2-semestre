programa
{
    /*
     * Módulo utilidades - versão em Portugol de utilidades.py
     *
     * O Portugol não tem *args nem **kwargs: para uma quantidade
     * variável de preços usamos vetor + tamanho, e para dados nomeados
     * do aluno usamos parâmetros fixos em vez de um dicionário livre.
     */

    // Converte uma temperatura de Celsius para Fahrenheit.
    funcao real celsius_para_fahrenheit(real celsius)
    {
        retorne celsius * 9.0 / 5.0 + 32.0
    }

    // Retorna verdadeiro se a senha tiver 8 ou mais caracteres.
    funcao logico validar_senha(cadeia senha)
    {
        retorne comprimento(senha) >= 8
    }

    /*
     * Recebe um vetor de preços e o tamanho, e devolve o total via
     * retorno e o mais caro/a média via parâmetros por referência
     * (o Portugol só devolve um valor por função).
     */
    funcao real caixa(real precos[10], inteiro tamanho, real &mais_caro, real &media)
    {
        real total = 0.0
        inteiro i

        mais_caro = precos[0]

        para (i = 0; i < tamanho; i = i + 1)
        {
            total = total + precos[i]
            se (precos[i] > mais_caro)
            {
                mais_caro = precos[i]
            }
        }

        media = total / tamanho
        retorne total
    }

    // Ficha do aluno com campos fixos (equivale ao **dados do Python).
    funcao vazio ficha_aluno(cadeia nome, inteiro matricula, cadeia curso)
    {
        escreva("nome: ", nome, "\n")
        escreva("matricula: ", matricula, "\n")
        escreva("curso: ", curso, "\n")
    }

    funcao inicio()
    {
        real precos[3] = {19.9, 45.0, 7.5}
        real mais_caro
        real media
        real total

        escreva("25°C = ", celsius_para_fahrenheit(25.0), "°F\n")
        escreva("Senha 'abc123' válida? ", validar_senha("abc123"), "\n")

        total = caixa(precos, 3, mais_caro, media)
        escreva("Caixa: total=", total, ", mais caro=", mais_caro, ", media=", media, "\n")

        ficha_aluno("Ana", 2026001, "ADS")
    }
}
