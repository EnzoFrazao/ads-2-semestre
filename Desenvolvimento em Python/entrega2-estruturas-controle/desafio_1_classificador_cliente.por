programa
{
    /*
     * Classificador de Cliente - versão em Portugol de
     * desafio_1_classificador_cliente.py
     *
     * Clientes menores de idade caem sempre em Bronze; os demais são
     * classificados pela renda mensal.
     */

    inteiro IDADE_MINIMA = 18
    real RENDA_PRATA = 2000.0
    real RENDA_OURO = 5000.0
    real RENDA_DIAMANTE = 10000.0

    funcao inicio()
    {
        inteiro idade
        real renda
        cadeia categoria

        escreva("Digite a idade do cliente: ")
        leia(idade)
        escreva("Digite a renda mensal do cliente: R$ ")
        leia(renda)

        se (idade < IDADE_MINIMA)
        {
            categoria = "Bronze"
        }
        senao se (renda >= RENDA_DIAMANTE)
        {
            categoria = "Diamante"
        }
        senao se (renda >= RENDA_OURO)
        {
            categoria = "Ouro"
        }
        senao se (renda >= RENDA_PRATA)
        {
            categoria = "Prata"
        }
        senao
        {
            categoria = "Bronze"
        }

        escreva("Cliente classificado como: ", categoria, "\n")
    }
}
