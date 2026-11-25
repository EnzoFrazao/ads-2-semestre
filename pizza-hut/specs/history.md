# Marcos do projeto

## 2026-11-11 — protótipo inicial

- Painel com 8 abas, tema claro e escuro, Chef Hut simulado, modo apresentação e demonstração de carga.
- Referência: criação de `pizza-hut/` no Git.

## 2026-11-23 — publicação no GitHub Pages

- O protótipo passou a ser publicado em `/pizza-hut/` do site de Pages do repositório, ao lado da atividade de CI/CD.

## 2026-11-23 — ajuste após reunião de apresentação ao cliente

- O tempo de entrega passou a ser do pedido até o despacho, com meta de 15 min (antes 40 min).
- Nova aba Produção (KDS), com tempo por etapa, no lugar do ranking de pessoas da aba Equipe.
- Alerta de dias fora do padrão e cobertura do tempo até o cliente (só motoboy iFood).

## 2026-11-23 — planta da cozinha na aba Produção

- Desenho 2D da cozinha vista de cima, com o tempo de cada etapa no lugar onde ela acontece (`PlantaKds.jsx`).

## 2026-11-25 — decisões do cliente e novas funcionalidades

- Decisões P-001 a P-005 fechadas (meta de 15 min, carga diária, fontes por planilha e API, regra de estoque por item).
- Novos: resumo do dia, aviso de dados desatualizados, alerta de atraso na planta, comparativo semana a semana, placar entre lojas, mapa de pico de pedidos e divergência crescente de estoque.
- Volume de pedidos fictício reduzido (cerca de 1.800 por semana, antes quase 5 mil) para ficar realista.
