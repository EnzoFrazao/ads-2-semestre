# Estratégia e mapa de testes

**Última verificação:** 2026-11-25

## Gates

| Comando | Evidência |
|---|---|
| `npm run build` | O projeto compila e empacota sem erro |

## Responsabilidade por camada

Não há testes automatizados. Em 2026-11-25 as funcionalidades novas foram conferidas no navegador (aviso de dados desatualizados e simulação de atraso, resumo do dia, alerta da planta, mapa de pico, divergência crescente, placar e comparativo semanal), sem erro no console. A conferência de comportamento é manual: abrir `npm run dev`, percorrer
as abas nos temas claro e escuro, e conferir que os números das telas, dos alertas e do Chef Hut
batem entre si (todos saem de `src/data/`).

## Mapa por capacidade

| Capability | Evidência | Situação |
|---|---|---|
| `core` | `npm run build` e conferência manual no navegador | Compila; sem teste automatizado |

## Lacunas

- Sem testes para `src/data/kds.js` (níveis, detecção de dias fora do padrão) e `src/data/metrics.js`.
  São funções puras e o primeiro candidato a teste; os módulos usam importações sem extensão, então
  exigem um executor que resolva isso (por exemplo, Vitest).
- Sem verificação automática de acessibilidade.
