# Entrega 2 — Estilização do Formulário de Inscrição (Semana 02)

Entregável da Semana 02: estilização em CSS do formulário de inscrição do blog (Entrega 1),
aplicando Flexbox para organizar os campos e dar acabamento visual ao container e ao botão.

## Conteúdo

| Arquivo | O que faz |
| --- | --- |
| `index.html` | Mesma estrutura semântica da Entrega 1, com `<link rel="stylesheet" href="style.css">` no `head` e os campos do formulário agrupados em `div.campo`/`div.linha-dupla` para permitir o layout Flexbox. |
| `style.css` | Reset básico, estilos gerais da página e estilização completa do formulário de inscrição. |
| `placeholder-artigo-1.svg` / `placeholder-artigo-2.svg` | Ilustrações locais em SVG usadas nos `<img>` dos artigos (mesmas da Entrega 1). |

## Como executar

Abra `index.html` direto no navegador, ou use a extensão Live Server do VS Code para recarregar
automaticamente ao salvar o CSS.

```bash
# qualquer servidor estático também funciona, ex.:
python -m http.server 8000
```

## Padrões

- `.form-inscricao` é o container do formulário: `max-width`, `padding` e `background-color`
  (`#e2e8f0`) diferente do fundo da página (`#f8fafc`).
- `fieldset` usa `display: flex; flex-direction: column; gap: 16px` para empilhar os campos.
- `label`, `input` e `select` estilizados com `padding`, `border`, `border-radius` e `font-size`.
- Botão de envio com `background-color`, `color`, `padding`, `cursor: pointer` e um
  `button:hover` mais escuro para dar acabamento.
- Bônus: `.linha-dupla` usa `display: flex; justify-content: space-between` para colocar os
  campos de nome e e-mail lado a lado.
- Reset (`* { margin: 0; padding: 0; box-sizing: border-box; }`) evita que padding estoure a
  largura definida no container.
- Testado no navegador: layout responde bem ao redimensionar a janela, o botão reage ao hover,
  e a validação nativa dos campos continua funcionando normalmente após a estilização.
- CSS validado sem erros em [jigsaw.w3.org/css-validator](https://jigsaw.w3.org/css-validator/).
