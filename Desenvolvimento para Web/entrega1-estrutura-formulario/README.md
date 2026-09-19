# Entrega 1 — Estrutura Base e Formulário de Inscrição (Semana 01)

Entregável da Semana 01: estrutura semântica de um blog em HTML5 e formulário de inscrição
na newsletter, dentro do `<aside>`, tudo consolidado em um único `index.html`.

## Conteúdo

| Arquivo | O que faz |
| --- | --- |
| `index.html` | Página única do blog: `header` (h1 + nav com 3 links), `main` com 2 `article` (h2 + p + img), `aside` com o formulário de inscrição, `footer`. |
| `placeholder-artigo-1.svg` / `placeholder-artigo-2.svg` | Ilustrações locais em SVG usadas nos `<img>` dos artigos — evitam depender de internet na correção. |

## Como executar

Abra `index.html` direto no navegador, ou use a extensão Live Server do VS Code para recarregar
automaticamente ao salvar.

```bash
# qualquer servidor estático também funciona, ex.:
python -m http.server 8000
```

## Padrões

- Um único `index.html`, com `<!DOCTYPE html>`, `<html lang="pt-BR">`, `head` e `body`.
- Uso correto de tags semânticas: `header`, `nav` (3 links), `main`, `aside`, `footer`.
- Cada `article` tem exatamente um `h2`, um `p` e uma `img` com `alt` descritivo.
- Formulário com `method="get"`, agrupado em `fieldset` + `legend`.
- Campos obrigatórios: `nome` (`minlength="3"`), `email` (`type="email"`), `idade`
  (`type="number"`, `min="18"`, `max="120"`) — todos `required`.
- `select` com 3 assuntos e checkbox "aceito os termos" também `required`.
- Todo campo tem `<label for="...">` ligado ao `id` do respectivo `input`/`select`.
- Testado no navegador: hierarquia de títulos (`h1` → `h2`) confirmada na aba Elements do
  DevTools; envio do formulário preenchido reflete os campos na querystring da URL
  (`?nome=...&email=...&idade=...&assunto=...&termos=on`); envio vazio é bloqueado pela
  validação nativa (`required`), que destaca os campos obrigatórios sem enviar a requisição.
- HTML validado sem erros em [validator.w3.org](https://validator.w3.org).
