# Estado do projeto

## Visão atual
techX — front-end de banco digital mobile (React + Vite + TS + Tailwind 4), 13 telas
com fluxo Pix completo. Nasceu de um arquivo Figma Make que foi auditado e reescrito.
Sem backend: dados em `src/data/mock.ts`.

## Pendências
- [ ] Nenhum teste automatizado. Ver `specs/testing.md` — prioridade 1 é unitário em `lib/`
- [ ] Definir se haverá API real (`specs/open-decisions.md` #2). Ponto de troca já isolado em `lib/useAsyncData.ts`
- [ ] Login é fachada: aceita qualquer senha de 6 dígitos, não guarda sessão
- [ ] Pix cobrar / copia e cola / QR Code e as ações Pagar/Transferir/Recarga só mostram aviso
- [ ] Decidir se publica em GitHub Pages — `base: "./"` e `HashRouter` já deixam o `dist/` pronto, mas não há CI

## Decisões importantes
- **Dinheiro em centavos** (`amountCents`, inteiro). Só vira decimal no formatador. Evita erro de ponto flutuante ao somar.
- **`REFERENCE_DATE` fixa em 2026-08-20T09:41**, não `new Date()`. Sem isso os dados de demonstração envelheceriam e os screenshots do README não seriam reprodutíveis. `formatRelativeDay` já aceita a data de hoje como 2º argumento para quando houver API.
- **`HashRouter`, não `BrowserRouter`.** O destino é site estático sem servidor para reescrever rotas. Trocar só se surgir servidor próprio.
- **Estado do Pix em contexto, não na URL.** Recarregar `/pix/valor` direto redireciona para `/pix/destino` — é intencional, colocar valor monetário na URL seria pior.
- **Tokens em `@theme` dentro de `src/index.css`**, não em `tailwind.config`. Fonte única para utilitário Tailwind e CSS puro.
- **Não publicar no Figma** (2026-08-20): cota de chamadas MCP do plano Starter esgotada e conta com seat "View". O arquivo Make segue na v4, divergente deste repo — ver `specs/open-decisions.md` #5.
- **O domínio (finanças/Pix) foi escolhido pela IA no Figma Make**, não pelo autor; confirmado como "manter" em 2026-08-20. Se o tema do trabalho for outro, a estrutura serve mas toda a copy precisa mudar.

## Armadilhas conhecidas
- `npm run screens` **exige `npm run build` antes** — ele serve o `dist/`, não o dev server. Se a porta 4173 ficar presa de uma execução anterior, o script falha ao subir; `npx kill-port 4173` resolve.
- As telas do fluxo Pix não são alcançáveis por URL. O script de screenshots as atinge **clicando pela UI** — se um rótulo de botão mudar, `clickByText` quebra.
- Heredoc de shell corrompe arquivos `.tsx` grandes neste ambiente (quebra em apóstrofos/JSX). Usar a ferramenta de escrita de arquivo para esses casos.

## Última sessão (2026-08-20, Claude)
- Auditado o arquivo Figma Make `NdDqbymWZZKF6Jm1O49iof` pelo histórico das 4 versões — a v4 abandonou as regras lo-fi do prompt original. Nada do código gerado foi portado; só a direção visual.
- Criado o projeto do zero: 13 telas, rotas reais, tokens com contraste WCAG AA verificado, ícones `lucide-react` no lugar dos emojis, estados de loading/vazio/erro e validação no Pix.
- Gerados os 13 screenshots por script e escrito o README com galeria, mapa de navegação e a tabela do que mudou em relação ao Figma Make.
