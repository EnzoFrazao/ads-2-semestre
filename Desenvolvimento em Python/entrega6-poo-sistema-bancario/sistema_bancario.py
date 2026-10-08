import re
from abc import ABC, abstractmethod

PADRAO_EMAIL = r"^[\w\.-]+@[\w\.-]+\.\w+$"


class SaldoInsuficienteError(Exception):
    """Levantada quando uma conta não tem saldo (ou limite) suficiente para um saque."""


class Cliente:
    def __init__(self, nome, cpf, email):
        self.nome = nome
        self.cpf = cpf
        self.email = email

    @property
    def email(self):
        return self._email

    @email.setter
    def email(self, novo_email):
        if not re.match(PADRAO_EMAIL, novo_email):
            raise ValueError(f"E-mail inválido: '{novo_email}'")
        self._email = novo_email

    def __str__(self):
        return f"{self.nome} ({self.email})"

    def __repr__(self):
        return f"Cliente(nome={self.nome!r}, cpf={self.cpf!r}, email={self.email!r})"


class Conta(ABC):
    def __init__(self, numero, titular, saldo_inicial=0.0):
        self.numero = numero
        self.titular = titular
        self.saldo = saldo_inicial

    @property
    def saldo(self):
        return self._saldo

    @saldo.setter
    def saldo(self, novo_saldo):
        if novo_saldo < 0:
            raise ValueError("Saldo não pode ser negativo")
        self._saldo = novo_saldo

    def depositar(self, valor):
        if valor <= 0:
            raise ValueError("O valor do depósito deve ser maior que zero")
        self.saldo = self.saldo + valor

    def sacar(self, valor):
        if valor <= 0:
            raise ValueError("O valor do saque deve ser maior que zero")
        if valor > self.saldo:
            raise SaldoInsuficienteError(
                f"Saldo insuficiente: saldo atual R$ {self.saldo:.2f}, saque de R$ {valor:.2f}"
            )
        self.saldo = self.saldo - valor

    @abstractmethod
    def calcular_rendimento(self):
        """Cada tipo de conta rende (ou cobra) de um jeito diferente."""

    def __str__(self):
        return f"Conta {self.numero} de {self.titular.nome} | saldo R$ {self.saldo:.2f}"

    def __repr__(self):
        return f"{type(self).__name__}(numero={self.numero!r}, saldo={self.saldo!r})"

    def __eq__(self, outra):
        if not isinstance(outra, Conta):
            return NotImplemented
        return self.numero == outra.numero

    def __lt__(self, outra):
        if not isinstance(outra, Conta):
            return NotImplemented
        return self.saldo < outra.saldo


class ContaCorrente(Conta):
    def __init__(self, numero, titular, saldo_inicial=0.0, limite=500.0):
        self.limite = limite
        super().__init__(numero, titular, saldo_inicial)

    @property
    def saldo(self):
        return self._saldo

    @saldo.setter
    def saldo(self, novo_saldo):
        if novo_saldo < -self.limite:
            raise ValueError("Saldo não pode passar do limite do cheque especial")
        self._saldo = novo_saldo

    def sacar(self, valor):
        if valor <= 0:
            raise ValueError("O valor do saque deve ser maior que zero")
        if valor > self.saldo + self.limite:
            raise SaldoInsuficienteError(
                f"Saldo e limite insuficientes: disponível R$ {self.saldo + self.limite:.2f}, "
                f"saque de R$ {valor:.2f}"
            )
        self.saldo = self.saldo - valor

    def calcular_rendimento(self):
        # Conta corrente não rende; mantida para cumprir o contrato da classe abstrata.
        return 0.0

    def __str__(self):
        return f"{super().__str__()} | limite R$ {self.limite:.2f} (Conta Corrente)"


class ContaPoupanca(Conta):
    def __init__(self, numero, titular, saldo_inicial=0.0, taxa_rendimento=0.005):
        super().__init__(numero, titular, saldo_inicial)
        self.taxa_rendimento = taxa_rendimento

    def calcular_rendimento(self):
        return self.saldo * self.taxa_rendimento

    def __str__(self):
        return f"{super().__str__()} | taxa {self.taxa_rendimento:.2%} (Conta Poupança)"


if __name__ == "__main__":
    clientes = [
        Cliente("Ana Silva", "111.111.111-11", "ana@email.com"),
        Cliente("Bruno Costa", "222.222.222-22", "bruno@email.com"),
        Cliente("Carla Souza", "333.333.333-33", "carla@email.com"),
        Cliente("Diego Lima", "444.444.444-44", "diego@email.com"),
    ]

    contas = [
        ContaCorrente(1001, clientes[0], saldo_inicial=1500.0, limite=500.0),
        ContaCorrente(1002, clientes[1], saldo_inicial=200.0, limite=300.0),
        ContaPoupanca(2001, clientes[2], saldo_inicial=3000.0, taxa_rendimento=0.006),
        ContaPoupanca(2002, clientes[3], saldo_inicial=800.0, taxa_rendimento=0.004),
        ContaCorrente(1003, clientes[0], saldo_inicial=50.0, limite=100.0),
        ContaPoupanca(2003, clientes[1], saldo_inicial=10000.0, taxa_rendimento=0.006),
        ContaCorrente(1004, clientes[2], saldo_inicial=0.0, limite=200.0),
        ContaPoupanca(2004, clientes[3], saldo_inicial=50.0, taxa_rendimento=0.004),
        ContaCorrente(1005, clientes[1], saldo_inicial=750.0, limite=500.0),
        ContaPoupanca(2005, clientes[0], saldo_inicial=1200.0, taxa_rendimento=0.006),
    ]

    print("===== EXTRATO DE TODAS AS CONTAS =====")
    for conta in contas:
        print(conta)

    print("\n===== POLIMORFISMO: RENDIMENTO DE CADA CONTA =====")
    for conta in contas:
        rendimento = conta.calcular_rendimento()
        print(f"{type(conta).__name__} {conta.numero}: rendimento de R$ {rendimento:.2f}")

    print("\n===== OPERAÇÕES COM TRATAMENTO DE EXCEÇÕES =====")
    try:
        contas[1].sacar(10_000.0)
    except SaldoInsuficienteError as erro:
        print(f"Falha no saque da conta {contas[1].numero}: {erro}")

    try:
        Cliente("Elisa Rocha", "555.555.555-55", "email-invalido")
    except ValueError as erro:
        print(f"Falha ao cadastrar cliente: {erro}")

    print("\n===== COMPARAÇÕES ENTRE CONTAS (__eq__ e __lt__) =====")
    conta_mais_rica = max(contas)
    conta_mais_pobre = min(contas)
    print(f"Conta com maior saldo: {conta_mais_rica}")
    print(f"Conta com menor saldo: {conta_mais_pobre}")
    print(f"contas[0] == contas[0]: {contas[0] == contas[0]}")
    print(f"contas[0] == contas[1]: {contas[0] == contas[1]}")
