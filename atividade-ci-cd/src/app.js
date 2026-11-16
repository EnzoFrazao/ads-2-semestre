import { describeRun, summarizeRuns, formatBuildDate } from "./deploy-info.js";

const $ = (id) => document.getElementById(id);

async function init() {
  const build = await fetch("./build-info.json").then((r) => r.json()).catch(() => null);
  if (build) {
    $("sha").textContent = build.sha.slice(0, 7);
    $("branch").textContent = build.branch;
    $("date").textContent = formatBuildDate(build.builtAt);
    $("repo").textContent = build.repo;
    $("repo").href = `https://github.com/${build.repo}`;
    await loadRuns(build.repo);
  } else {
    $("sha").textContent = "local";
    $("branch").textContent = "—";
    $("date").textContent = formatBuildDate(new Date().toISOString());
    $("rate").textContent = "—";
    $("runs").innerHTML = "<li>Rode o build para ver as execuções.</li>";
  }
}

async function loadRuns(repo) {
  const list = $("runs");
  try {
    const url = `https://api.github.com/repos/${repo}/actions/workflows/ci-cd.yml/runs?per_page=5`;
    const { workflow_runs: runs } = await fetch(url).then((r) => {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    });
    const s = summarizeRuns(runs);
    $("rate").textContent = s.taxaSucesso === null ? "—" : `${s.taxaSucesso}%`;
    list.innerHTML = runs
      .map((run) => {
        const d = describeRun(run);
        return `<li><span class="badge ${d.tone}">${d.label}</span> <code>${d.sha}</code>
          <a href="${run.html_url}">execução #${run.run_number}</a></li>`;
      })
      .join("");
  } catch {
    $("rate").textContent = "—";
    list.innerHTML = "<li>Não foi possível consultar a API do GitHub agora.</li>";
  }
}

init();
