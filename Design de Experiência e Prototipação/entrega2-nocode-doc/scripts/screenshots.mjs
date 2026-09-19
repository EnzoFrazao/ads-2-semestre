/**
 * Captura as telas do techX em 390x844 @2x e grava em docs/screens/.
 *
 * Usa o Chrome já instalado na máquina via puppeteer-core, então não
 * baixa Chromium. Sobe `vite preview` sozinho e derruba no final.
 *
 *   npm run build && npm run screens
 */
import { spawn } from "node:child_process";
import { mkdir, readdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "docs", "screens");
const PORT = 4173;
const BASE = `http://localhost:${PORT}`;

const CHROME_CANDIDATES = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  process.env.LOCALAPPDATA
    ? path.join(process.env.LOCALAPPDATA, "Google/Chrome/Application/chrome.exe")
    : null,
  "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].filter(Boolean);

/** Telas alcançáveis diretamente por URL. */
const STATIC_SHOTS = [
  { file: "01-login", route: "/login" },
  { file: "02-inicio", route: "/" },
  { file: "03-extrato", route: "/extrato" },
  { file: "04-transacao-detalhe", route: "/transacao/t-001" },
  { file: "05-pix-hub", route: "/pix" },
  { file: "06-pix-destino", route: "/pix/destino" },
  { file: "11-cartoes", route: "/cartoes" },
  { file: "12-notificacoes", route: "/notificacoes" },
  { file: "13-mais", route: "/mais" },
];

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

async function main() {
  if (!existsSync(path.join(ROOT, "dist", "index.html"))) {
    throw new Error('dist/ não existe. Rode "npm run build" antes de "npm run screens".');
  }

  const chrome = CHROME_CANDIDATES.find((p) => existsSync(p));
  if (!chrome) {
    throw new Error(
      `Chrome não encontrado. Procurei em:\n${CHROME_CANDIDATES.join("\n")}`,
    );
  }

  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  const server = await startPreview();
  const browser = await puppeteer.launch({
    executablePath: chrome,
    headless: "new",
    args: ["--hide-scrollbars", "--force-color-profile=srgb", "--font-render-hinting=none"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });

    for (const shot of STATIC_SHOTS) {
      await open(page, shot.route);
      await capture(page, shot.file);
    }

    await pixJourney(page);
  } finally {
    await browser.close();
    server.kill();
  }

  const files = (await readdir(OUT)).filter((f) => f.endsWith(".png")).sort();
  console.log(`\n${files.length} telas geradas em docs/screens/`);
  for (const f of files) console.log(`  ${f}`);
}

/* --------------------------- Percurso do Pix ---------------------------- */
/* Estas telas dependem do estado do fluxo, então precisam ser percorridas.  */

async function pixJourney(page) {
  await open(page, "/pix");

  // Contato recente -> passo do valor
  await clickByLabelStart(page, "Marcos");
  await settle(page);

  // Digita R$ 120,00 no teclado numérico
  for (const key of ["1", "2", "0", "0", "0"]) {
    await page.click(`button[aria-label="${key}"]`);
  }
  await settle(page);
  await capture(page, "07-pix-valor");

  await clickByText(page, "Continuar");
  await settle(page);
  await capture(page, "08-pix-confirmar");

  await clickByText(page, "Confirmar e enviar");
  await new Promise((r) => setTimeout(r, 1400));
  await settle(page);
  await capture(page, "09-pix-sucesso");

  await clickByText(page, "Ver comprovante");
  await settle(page);
  await capture(page, "10-comprovante");
}

/* ------------------------------- Helpers -------------------------------- */

async function open(page, route) {
  await page.goto(`${BASE}/#${route}`, { waitUntil: "networkidle0" });
  await settle(page);
}

/** Espera fontes, dados simulados e animações assentarem. */
async function settle(page) {
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 1100));
  await page.evaluate(() => {
    document.documentElement.dataset.capture = "true";
    window.scrollTo(0, 0);
    document.querySelector("main")?.scrollTo(0, 0);
  });
  await new Promise((r) => setTimeout(r, 120));
}

async function capture(page, file) {
  const target = path.join(OUT, `${file}.png`);
  await page.screenshot({ path: target });
  console.log(`captured ${file}.png`);
}

async function clickByText(page, text) {
  const clicked = await page.evaluate((t) => {
    const el = [...document.querySelectorAll("button, a")].find((n) =>
      n.textContent?.trim().startsWith(t),
    );
    if (!el) return false;
    el.click();
    return true;
  }, text);
  if (!clicked) throw new Error(`Não achei elemento clicável com o texto "${text}"`);
}

async function clickByLabelStart(page, text) {
  const clicked = await page.evaluate((t) => {
    const el = [...document.querySelectorAll("button")].find((n) =>
      n.textContent?.trim().includes(t),
    );
    if (!el) return false;
    el.click();
    return true;
  }, text);
  if (!clicked) throw new Error(`Não achei botão contendo "${text}"`);
}

function startPreview() {
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.platform === "win32" ? "npm.cmd" : "npm",
      ["run", "preview", "--", "--port", String(PORT)],
      { cwd: ROOT, stdio: ["ignore", "pipe", "pipe"], shell: process.platform === "win32" },
    );

    const timer = setTimeout(
      () => reject(new Error("vite preview não subiu a tempo")),
      30_000,
    );

    child.stdout.on("data", (buf) => {
      if (buf.toString().includes(String(PORT))) {
        clearTimeout(timer);
        setTimeout(() => resolve(child), 600);
      }
    });
    child.stderr.on("data", (buf) => process.stderr.write(buf));
    child.on("error", reject);
  });
}
