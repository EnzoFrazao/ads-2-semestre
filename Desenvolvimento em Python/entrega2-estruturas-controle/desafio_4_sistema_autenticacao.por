programa
{
    /*
     * Sistema de Autenticação - versão em Portugol de
     * desafio_4_sistema_autenticacao.py
     *
     * O "enquanto" repete até acertar a senha OU esgotar as tentativas -
     * é essencial atualizar "tentativas" dentro do laço para não travar.
     */

    funcao inicio()
    {
        cadeia SENHA_CORRETA = "python123"
        inteiro MAX_TENTATIVAS = 3
        inteiro tentativas = 0
        logico autenticado = falso
        cadeia senha

        enquanto (tentativas < MAX_TENTATIVAS e autenticado == falso)
        {
            escreva("Digite a senha: ")
            leia(senha)
            tentativas = tentativas + 1

            se (senha == SENHA_CORRETA)
            {
                autenticado = verdadeiro
            }
            senao
            {
                escreva("Senha incorreta. Tentativas restantes: ", MAX_TENTATIVAS - tentativas, "\n")
            }
        }

        se (autenticado == verdadeiro)
        {
            escreva("Acesso liberado!\n")
        }
        senao
        {
            escreva("Acesso bloqueado: número máximo de tentativas excedido.\n")
        }
    }
}
