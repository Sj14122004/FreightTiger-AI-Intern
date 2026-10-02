function calculateRoutePriceComparison(weeklyMetrics) {
  const routeHistory = new Map();

  return weeklyMetrics.map((current) => {
    if (!routeHistory.has(current.route)) {
      routeHistory.set(current.route, []);
    }

    const history = routeHistory.get(current.route);
    const previousWeeks = history.slice(-8);

    let own_history_avg = null;
    let vs_own_history = null;

    if (previousWeeks.length > 0) {
      own_history_avg =
        previousWeeks.reduce(
          (sum, week) => sum + week.cost_per_tonne_km,
          0
        ) / previousWeeks.length;

      vs_own_history =
        (current.cost_per_tonne_km / own_history_avg - 1) * 100;
    }

    const result = {
      ...current,
      own_history_avg,
      vs_own_history
    };

    history.push(current);

    return result;
  });
}

module.exports = {
  calculateRoutePriceComparison
};