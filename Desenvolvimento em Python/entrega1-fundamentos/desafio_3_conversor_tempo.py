"""Conversor de tempo: recebe um valor em segundos e imprime em horas, minutos e segundos."""

total_segundos = int(input("Digite a quantidade de segundos: "))

horas = total_segundos // 3600
minutos = (total_segundos % 3600) // 60
segundos = total_segundos % 60

print(f"{total_segundos}s equivalem a {horas}h {minutos}min {segundos}s")
