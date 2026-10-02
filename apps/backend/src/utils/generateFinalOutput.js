const fs = require("fs");
const path = require("path");
require("dotenv").config();

const { stringify } = require("csv-stringify/sync");

const {
  loadAllRoutes,
  calculateAllRoutesMetrics
} = require("../services/analytics/allroutes");

const {
  calculateRoutePriceComparison
} = require("../services/analytics/routePriceComparison");

const {
  calculateRouteTypeComparison
} = require("../services/analytics/routeTypeComparison");

const {
  setRouteFlags
} = require("../services/analytics/routeFlagging");

const {
  searchContextNotes
} = require("../services/analytics/contextNoteRag");

const {
  findVerifiedContextNote
} = require("../services/analytics/contextNoteValidation");

const {
  generateLlmExplanation
} = require("../services/analytics/llmExplanation");

const {
  formatFinalOutput
} = require("./outputFormat");

const {
  logLlmUsage
} = require("./llmUsageLogger");

async function generateFinalOutput() {
  const generationStartTime = Date.now();

  const shipments = loadAllRoutes();
  const weeklyMetrics = calculateAllRoutesMetrics(shipments);
  const routePriceMetrics = calculateRoutePriceComparison(weeklyMetrics);
  const routeTypeMetrics = calculateRouteTypeComparison(routePriceMetrics);
  const flaggedMetrics = setRouteFlags(routeTypeMetrics);

  const finalMetrics = [];

  const llmUsage = {
    model: "llama3.2:latest",
    calls: 0,
    promptTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
    costUsd: 0,
    durationMs: 0
  };

  for (const routeMetric of flaggedMetrics) {
    let matched_note_id = null;
    let reason = "Unexplained";

    if (routeMetric.flagged) {
      const query =
        `${routeMetric.route} ${routeMetric.week_of} freight cost increase`;

      const candidates = await searchContextNotes(query, 3);

      const verifiedNote = findVerifiedContextNote(
        candidates,
        routeMetric.route,
        routeMetric.week_of
      );

      if (verifiedNote) {
        const llmResult = await generateLlmExplanation(
          verifiedNote.note
        );

        llmUsage.calls += 1;
        llmUsage.promptTokens += llmResult.usage.promptTokens;
        llmUsage.outputTokens += llmResult.usage.outputTokens;
        llmUsage.totalTokens += llmResult.usage.totalTokens;
        llmUsage.durationMs += llmResult.usage.durationMs;

        if (llmResult.explanation !== "Unexplained") {
          matched_note_id = verifiedNote.note_id;
          reason = llmResult.explanation;
        }
      }
    }

    finalMetrics.push({
      ...routeMetric,
      matched_note_id,
      reason
    });
  }

  llmUsage.durationMs = Date.now() - generationStartTime;

  logLlmUsage(llmUsage);

  const finalOutput = formatFinalOutput(finalMetrics);

  const csv = stringify(finalOutput, {
    header: true,
    columns: [
      "route",
      "week_of",
      "cost_per_tonne_km",
      "vs_own_history",
      "vs_similar_routes",
      "flagged",
      "matched_note_id",
      "reason"
    ]
  });

  const outputFile = path.join(__dirname, "../../final_output.csv");

  fs.writeFileSync(outputFile, csv, "utf-8");

  return {
    outputFile,
    rowCount: finalOutput.length,
    flaggedCount: finalOutput.filter(
      route => route.flagged
    ).length,
    rows: finalOutput,
    llmUsage
  };
}

module.exports = {
  generateFinalOutput
};