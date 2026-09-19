"""Sistema de Autenticação: solicita a senha até o usuário acertar, bloqueando após 3 erros."""

SENHA_CORRETA = "python123"
MAX_TENTATIVAS = 3

tentativas = 0
autenticado = False

while tentativas < MAX_TENTATIVAS and not autenticado:
    senha = input("Digite a senha: ")
    tentativas += 1

    if senha == SENHA_CORRETA:
        autenticado = True
    else:
        print(f"Senha incorreta. Tentativas restantes: {MAX_TENTATIVAS - tentativas}")

if autenticado:
    print("Acesso liberado!")
else:
    print("Acesso bloqueado: número máximo de tentativas excedido.")
