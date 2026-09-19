# Histórico

## 2026-08-20 — Auditoria do Figma Make e reescrita do front

Ponto de partida: repositório vazio (só `README.md` com uma linha) e um arquivo
Figma Make em sua 4ª versão.

**Auditoria.** As 4 versões do Make foram lidas pelo histórico do arquivo:
v1 wireframe cinza de 3 telas → v2 telas separadas → v3 interativo com 5 abas →
v4 `"melhore. deixe mais bonito e colorido"`, que refez tudo em dark + roxo.
A v4 abandonou as regras lo-fi do prompt original (escala de cinza, sem ícone real,
input tracejado), o que foi confirmado como intencional pelo autor.

**Reescrita.** O código gerado (um `App.tsx` + `index.css`) não foi portado. A
direção visual da v4 foi mantida; a estrutura foi refeita em 4 camadas, 13 telas e
rotas reais. Treze problemas foram corrigidos — a tabela completa está no
[README](../README.md#o-que-mudou-em-relação-ao-figma-make).

**Marco.** Primeira versão publicada em `EnzoFrazao/techXfront`, com build limpo
(`tsc -b` em `strict`), as 13 telas capturadas por script e README documentando
telas, fluxo e design system.
