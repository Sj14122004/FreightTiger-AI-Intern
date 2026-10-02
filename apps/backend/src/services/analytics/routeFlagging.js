const FLAG_THRESHOLD = 20;

function setRouteFlags(routeMetrics) {
  return routeMetrics.map((route) => {
    const exceedsOwnHistory =
      route.vs_own_history !== null &&
      route.vs_own_history > FLAG_THRESHOLD;

    const exceedsSimilarRoutes =
      route.vs_similar_routes !== null &&
      route.vs_similar_routes > FLAG_THRESHOLD;

    return {
      ...route,
      flagged: exceedsOwnHistory || exceedsSimilarRoutes
    };
  });
}

module.exports = {
  setRouteFlags
};