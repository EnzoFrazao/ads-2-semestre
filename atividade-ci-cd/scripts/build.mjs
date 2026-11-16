// Copia src/ para dist/ e grava build-info.json com os dados do commit (vindos do GitHub Actions).
import { copyFileSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";

// Cópia manual: fs.cpSync derruba o Node 22.23 no Windows (crash nativo).
function copyDir(from, to) {
  mkdirSync(to, { recursive: true });
  for (const e of readdirSync(from, { withFileTypes: true })) {
    const src = `${from}/${e.name}`;
    const dst = `${to}/${e.name}`;
    if (e.isDirectory()) copyDir(src, dst);
    else copyFileSync(src, dst);
  }
}

rmSync("dist", { recursive: true, force: true });
copyDir("src", "dist");

const info = {
  sha: process.env.GITHUB_SHA ?? "local",
  branch: process.env.GITHUB_REF_NAME ?? "local",
  repo: process.env.GITHUB_REPOSITORY ?? "EnzoFrazao/ads-2-semestre",
  builtAt: new Date().toISOString(),
};
writeFileSync("dist/build-info.json", JSON.stringify(info, null, 2));
console.log("build ok", info);
