// Lógica pura (sem DOM): fica fácil de testar no CI.

const STATUS = {
  success: { label: "Sucesso", tone: "ok" },
  failure: { label: "Falhou", tone: "bad" },
  cancelled: { label: "Cancelado", tone: "warn" },
  in_progress: { label: "Em andamento", tone: "warn" },
  queued: { label: "Na fila", tone: "warn" },
};

/** Converte o estado bruto de uma execução do GitHub Actions em rótulo + tom visual. */
export function describeRun(run) {
  const key = run.status === "completed" ? run.conclusion : run.status;
  const info = STATUS[key] ?? { label: key ?? "Desconhecido", tone: "warn" };
  return { id: run.id, sha: String(run.head_sha ?? "").slice(0, 7), ...info };
}

/** Resume uma lista de execuções: contagens e taxa de sucesso (só conta as concluídas). */
export function summarizeRuns(runs) {
  const done = runs.filter((r) => r.status === "completed");
  const ok = done.filter((r) => r.conclusion === "success").length;
  return {
    total: runs.length,
    concluidas: done.length,
    sucessos: ok,
    falhas: done.length - ok,
    taxaSucesso: done.length === 0 ? null : Math.round((ok / done.length) * 100),
  };
}

/** Formata a data de build para o fuso de Brasília. */
export function formatBuildDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "data indisponível";
  return d.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
}
