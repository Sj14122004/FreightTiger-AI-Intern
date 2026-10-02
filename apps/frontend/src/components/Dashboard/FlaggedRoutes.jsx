function getSeverity(metric) {
  const own = metric.vs_own_history ?? 0;
  const similar = metric.vs_similar_routes ?? 0;

  return Math.max(own, similar);
}

function formatPercentage(value) {
  if (value === null || value === undefined) {
    return "N/A";
  }

  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}

function FlaggedRoutes({ metrics = [], onSelect }) {
  const flaggedRoutes = metrics
    .filter((metric) => metric.flagged)
    .sort((a, b) => getSeverity(b) - getSeverity(a))
    .slice(0, 5);

  const flaggedCount = metrics.filter(
    (metric) => metric.flagged
  ).length;

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-red-600">
            Attention Required
          </p>

          <h2 className="mt-1 text-lg font-semibold text-slate-900">
            Top 5 Flagged Route-Weeks
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Route-weeks with the largest detected cost increases.
          </p>
        </div>

        <span className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600">
          {flaggedCount} flagged
        </span>
      </div>

      {flaggedRoutes.length === 0 ? (
        <div className="p-10 text-center">
          <p className="text-sm font-semibold text-slate-700">
            No flagged route-weeks
          </p>

          <p className="mt-1 text-sm text-slate-500">
            No unusual cost increases were detected.
          </p>
        </div>
      ) : (
        <div>
          {flaggedRoutes.map((metric, index) => (
            <button
              key={`${metric.route}-${metric.week_of}`}
              type="button"
              onClick={() => onSelect?.(metric)}
              className="flex w-full items-center gap-4 border-b border-slate-100 p-5 text-left last:border-b-0 hover:bg-slate-50"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-red-50 text-sm font-semibold text-red-600">
                {index + 1}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-sm font-semibold text-slate-900">
                    {metric.route}
                  </p>

                  <span className="text-xs text-slate-400">
                    {metric.week_of}
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500">
                  <span>
                    Cost:
                    <strong className="ml-1 text-slate-700">
                      {metric.cost_per_tonne_km?.toFixed(3)}
                    </strong>
                  </span>

                  <span>
                    Own:
                    <strong className="ml-1 text-red-600">
                      {formatPercentage(metric.vs_own_history)}
                    </strong>
                  </span>

                  <span>
                    Similar:
                    <strong className="ml-1 text-red-600">
                      {formatPercentage(metric.vs_similar_routes)}
                    </strong>
                  </span>
                </div>
              </div>

              <span className="hidden rounded-md bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-600 sm:block">
                Flagged
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

export default FlaggedRoutes;