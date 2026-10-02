function formatFinalOutput(routeMetrics) {
  return routeMetrics.map((route) => ({
    route: route.route,
    week_of: route.week_of,
    cost_per_tonne_km: route.cost_per_tonne_km,
    vs_own_history: route.vs_own_history,
    vs_similar_routes: route.vs_similar_routes,
    flagged: route.flagged,
    matched_note_id: route.matched_note_id,
    reason: route.reason
  }));
}

module.exports = {
  formatFinalOutput
};