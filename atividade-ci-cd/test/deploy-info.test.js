import { test } from "node:test";
import assert from "node:assert/strict";
import { describeRun, summarizeRuns, formatBuildDate } from "../src/deploy-info.js";

test("describeRun: execução concluída com sucesso fica verde", () => {
  const r = describeRun({ id: 1, status: "completed", conclusion: "success", head_sha: "abcdef1234567" });
  assert.deepEqual(r, { id: 1, sha: "abcdef1", label: "Sucesso", tone: "ok" });
});

test("describeRun: falha fica vermelha e em andamento fica amarela", () => {
  assert.equal(describeRun({ status: "completed", conclusion: "failure" }).tone, "bad");
  assert.equal(describeRun({ status: "in_progress" }).label, "Em andamento");
});

test("summarizeRuns: calcula taxa de sucesso só com as concluídas", () => {
  const s = summarizeRuns([
    { status: "completed", conclusion: "success" },
    { status: "completed", conclusion: "failure" },
    { status: "in_progress" },
    { status: "completed", conclusion: "success" },
  ]);
  assert.deepEqual(s, { total: 4, concluidas: 3, sucessos: 2, falhas: 1, taxaSucesso: 67 });
});

test("summarizeRuns: lista vazia não divide por zero", () => {
  assert.equal(summarizeRuns([]).taxaSucesso, null);
});

test("formatBuildDate: data inválida não quebra", () => {
  assert.equal(formatBuildDate("xx"), "data indisponível");
  assert.match(formatBuildDate("2026-11-16T12:00:00Z"), /16\/11\/2026/);
});
