import csv
import re

PADRAO_EMAIL = r"^[\w\.-]+@[\w\.-]+\.\w+$"
PADRAO_CPF = r"^\d{3}\.\d{3}\.\d{3}-\d{2}$"
PADRAO_TELEFONE = r"^\(\d{2}\)\s?\d{4,5}-\d{4}$"
PADRAO_DATA = r"^\d{2}/\d{2}/\d{4}$"


class FormatoInvalidoError(Exception):
    """Levantada quando um campo do registro não segue o formato esperado."""


def validar_campo(valor, padrao, nome_campo):
    if not re.match(padrao, valor):
        raise FormatoInvalidoError(f"{nome_campo} inválido: '{valor}'")


def validar_registro(registro):
    validar_campo(registro["email"], PADRAO_EMAIL, "E-mail")
    validar_campo(registro["cpf"], PADRAO_CPF, "CPF")
    validar_campo(registro["telefone"], PADRAO_TELEFONE, "Telefone")
    validar_campo(registro["data_nascimento"], PADRAO_DATA, "Data de nascimento")

    idade = int(registro["idade"])
    if idade < 0:
        raise ValueError("Idade não pode ser negativa")
    return idade


def processar_arquivo(caminho):
    registros_validos = []
    registros_invalidos = []

    try:
        with open(caminho, encoding="utf-8") as arquivo:
            leitor = csv.DictReader(arquivo)
            for numero_linha, registro in enumerate(leitor, start=1):
                try:
                    idade = validar_registro(registro)
                    registros_validos.append({**registro, "idade": idade})
                except FormatoInvalidoError as erro:
                    registros_invalidos.append((numero_linha, str(erro)))
                except ValueError as erro:
                    registros_invalidos.append((numero_linha, f"Idade inválida: {erro}"))
                except KeyError as erro:
                    registros_invalidos.append((numero_linha, f"Coluna ausente no CSV: {erro}"))
    except FileNotFoundError:
        print(f"Arquivo não encontrado: {caminho}\n")
        return [], []
    else:
        print(f"Arquivo {caminho} lido com sucesso.")
    finally:
        print(f"Tentativa de leitura de {caminho} finalizada.\n")

    return registros_validos, registros_invalidos


def imprimir_relatorio(caminho, validos, invalidos):
    total = len(validos) + len(invalidos)

    print(f"===== RELATÓRIO: {caminho} =====")
    print(f"Total de registros: {total}")

    print(f"Registros válidos ({len(validos)}):")
    for registro in validos:
        print(f"  {registro['nome']} | {registro['email']} | idade {registro['idade']}")

    print(f"Registros inválidos ({len(invalidos)}):")
    for numero_linha, motivo in invalidos:
        print(f"  Linha {numero_linha}: {motivo}")

    print()


if __name__ == "__main__":
    validos, invalidos = processar_arquivo("dados.csv")
    imprimir_relatorio("dados.csv", validos, invalidos)

    # Demonstra o tratamento de FileNotFoundError.
    processar_arquivo("arquivo_inexistente.csv")

    # Demonstra o tratamento de KeyError: este CSV não tem a coluna "idade".
    validos_malformado, invalidos_malformado = processar_arquivo("dados_malformado.csv")
    imprimir_relatorio("dados_malformado.csv", validos_malformado, invalidos_malformado)
