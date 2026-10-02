const {
  generateLlmExplanation
} = require("../src/services/analytics/llmExplanation");

async function run() {
  try {
    const routeMetric = {
      route: "Chennai-Bangalore",
      week_of: "2025-02-24",
      cost_per_tonne_km: 4.10,
      vs_own_history: 31.5,
      vs_similar_routes: 38.7
    };

    const evidence =
      "Heavy flooding on the Chennai-Bangalore highway disrupted normal truck movement from Feb 24 to Mar 8, forcing longer detours and higher trip costs.";

    console.log("Sending verified evidence to LLM...");

    const reason = await generateLlmExplanation(
      routeMetric,
      evidence
    );

    console.log("\nLLM explanation:");
    console.log(reason);
  } catch (error) {
    console.error("LLM explanation failed");
    console.error(error);
    process.exit(1);
  }
}

run();