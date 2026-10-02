const {
  calculateAllRoutesMetrics,
  loadAllRoutes
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
const fs = require("fs");
const path = require("path");
const {
  generateFinalOutput
} = require("../utils/generateFinalOutput");

const OUTPUT_FILE = path.join(__dirname, "../../final_output.csv");

async function getAllRoutesMetrics(req, res) {
  try {
    const shipments = loadAllRoutes();
    const weeklyMetrics = calculateAllRoutesMetrics(shipments);
    const routePriceMetrics = calculateRoutePriceComparison(weeklyMetrics);
    const routeTypeMetrics = calculateRouteTypeComparison(routePriceMetrics);
    const flaggedMetrics = setRouteFlags(routeTypeMetrics);

    const data = flaggedMetrics.map((route) => ({
      ...route,
      matched_note_id: null,
      reason: "Unexplained"
    }));

    res.json({
      success: true,
      route_week_count: data.length,
      flagged_count: data.filter((route) => route.flagged).length,
      data
    });
  } catch (error) {
    console.error("All routes metrics failed");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to load route metrics"
    });
  }
}

async function generateAllRoutesAnalysis(req, res) {
  try {
    const result = await generateFinalOutput();

    res.json({
      success: true,
      message: "Analysis generated successfully",
      data: result
    });
  } catch (error) {
    console.error("All routes analysis generation failed");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to generate analysis"
    });
  }
}

function downloadFinalOutput(req, res) {
  if (!fs.existsSync(OUTPUT_FILE)) {
    return res.status(404).json({
      success: false,
      message: "Final analysis has not been generated yet"
    });
  }

  res.download(OUTPUT_FILE, "final_output.csv", (error) => {
    if (error) {
      console.error("Final output download failed");
    }
  });
}

module.exports = {
  getAllRoutesMetrics,
  generateAllRoutesAnalysis,
  downloadFinalOutput
};