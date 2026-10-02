const fs = require("fs");
const path = require("path");

const logsDirectory = path.join(__dirname, "../../logs");
const logFile = path.join(logsDirectory, "llm_usage.csv");

function ensureLogFile() {
  if (!fs.existsSync(logsDirectory)) {
    fs.mkdirSync(logsDirectory, { recursive: true });
  }

  if (!fs.existsSync(logFile)) {
    fs.writeFileSync(
      logFile,
      [
        "timestamp",
        "model",
        "calls",
        "prompt_tokens",
        "output_tokens",
        "total_tokens",
        "cost_usd",
        "duration_ms"
      ].join(",") + "\n",
      "utf-8"
    );
  }
}

function logLlmUsage(usage) {
  ensureLogFile();

  const row = [
    new Date().toISOString(),
    usage.model,
    usage.calls,
    usage.promptTokens,
    usage.outputTokens,
    usage.totalTokens,
    usage.costUsd,
    usage.durationMs
  ].join(",");

  fs.appendFileSync(logFile, `${row}\n`, "utf-8");
}

module.exports = {
  logLlmUsage
};