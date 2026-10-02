function calculateRouteTypeComparison(weeklyMetrics) {
  const routeTypeWeeks = new Map();

  for (const metric of weeklyMetrics) {
    const key = `${metric.route_type}|${metric.week_of}`;

    if (!routeTypeWeeks.has(key)) {
      routeTypeWeeks.set(key, []);
    }

    routeTypeWeeks.get(key).push(metric);
  }

  return weeklyMetrics.map((current) => {
    const key = `${current.route_type}|${current.week_of}`;
    const peers = routeTypeWeeks
      .get(key)
      .filter((metric) => metric.route !== current.route);

    let similar_routes_avg = null;
    let vs_similar_routes = null;

    if (peers.length > 0) {
      similar_routes_avg =
        peers.reduce(
          (sum, peer) => sum + peer.cost_per_tonne_km,
          0
        ) / peers.length;

      vs_similar_routes =
        (current.cost_per_tonne_km / similar_routes_avg - 1) * 100;
    }

    return {
      ...current,
      similar_routes_avg,
      vs_similar_routes
    };
  });
}

module.exports = {
  calculateRouteTypeComparison
};