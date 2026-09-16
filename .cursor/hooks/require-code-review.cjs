#!/usr/bin/env node
/**
 * Blocks `git commit` until studia-code-reviewer has written a matching pass marker.
 * Bypass (bootstrap/emergencies only): STUDIA_SKIP_CODE_REVIEW=1
 */
"use strict";

const { createHash } = require("node:crypto");
const { execSync } = require("node:child_process");
const { existsSync, readFileSync, mkdirSync } = require("node:fs");
const { dirname, join } = require("node:path");

const root = join(__dirname, "..", "..");
const statePath = join(
  root,
  ".cursor",
  "hooks",
  "state",
  "code-review-ok.json",
);

function respond(payload) {
  process.stdout.write(JSON.stringify(payload));
}

function deny(agentMessage, userMessage) {
  respond({
    permission: "deny",
    agent_message: agentMessage,
    user_message: userMessage,
  });
}

function allow() {
  respond({ permission: "allow" });
}

function git(args) {
  return execSync(`git ${args}`, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  });
}

function readStdinSync() {
  try {
    return readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

try {
  const raw = readStdinSync();
  let input = {};
  try {
    input = JSON.parse(raw || "{}");
  } catch {
    input = {};
  }

  const command = String(input.command ?? "");

  // Only gate real commits (not docs mentioning the phrase in unrelated tools).
  // Matcher already filters; keep a second check for safety.
  if (
    !/(^|[;&|]\s*|&&\s*)git\s+commit\b/.test(command) &&
    !/\bgit\.exe\s+commit\b/i.test(command)
  ) {
    // Cursor may pass the bare command without shell operators
    if (!/\bgit\s+commit\b/.test(command)) {
      allow();
      process.exit(0);
    }
  }

  if (process.env.STUDIA_SKIP_CODE_REVIEW === "1") {
    allow();
    process.exit(0);
  }

  mkdirSync(dirname(statePath), { recursive: true });

  let staged = "";
  try {
    staged = git("diff --cached");
  } catch (err) {
    deny(
      `Não foi possível ler git diff --cached: ${err.message}`,
      "Code review obrigatório antes do commit.",
    );
    process.exit(0);
  }

  const source = staged.length > 0 ? "staged" : "unstaged";
  let payload = staged;
  if (!payload) {
    try {
      payload = git("diff");
    } catch {
      payload = "";
    }
  }

  const hash = createHash("sha256").update(payload, "utf8").digest("hex");

  if (!existsSync(statePath)) {
    deny(
      [
        "Commit bloqueado: code review Studia ainda não foi aprovado.",
        "1) Invoque o subagente `studia-code-reviewer` sobre o diff staged/atual.",
        "2) Corrija findings se Verdict=BLOCK.",
        "3) Só faça commit após Verdict=APPROVE (grava `.cursor/hooks/state/code-review-ok.json`).",
        `Hash esperado agora (${source}): ${hash.slice(0, 12)}…`,
      ].join("\n"),
      "Commit bloqueado até o subagente studia-code-reviewer aprovar as mudanças.",
    );
    process.exit(0);
  }

  let marker;
  try {
    marker = JSON.parse(readFileSync(statePath, "utf8"));
  } catch {
    deny(
      "Marker de review inválido. Rode `studia-code-reviewer` de novo.",
      "Code review inválido — rode o subagente novamente.",
    );
    process.exit(0);
  }

  if (marker?.ok !== true || marker?.hash !== hash) {
    deny(
      [
        "Commit bloqueado: o pass do code review não corresponde ao diff atual.",
        "Rode novamente o subagente `studia-code-reviewer` e só então faça o commit.",
        `Hash atual (${source}): ${hash.slice(0, 12)}…`,
        `Hash no marker: ${String(marker?.hash ?? "ausente").slice(0, 12)}…`,
      ].join("\n"),
      "Code review desatualizado — rode studia-code-reviewer de novo antes do commit.",
    );
    process.exit(0);
  }

  allow();
  process.exit(0);
} catch (err) {
  respond({
    permission: "deny",
    agent_message: `Hook require-code-review falhou: ${err && err.message ? err.message : String(err)}`,
    user_message:
      "Falha no hook de code review — verifique .cursor/hooks/require-code-review.cjs",
  });
  process.exit(0);
}
