function formatPercentage(value) {
  if (value === null || value === undefined) {
    return "N/A";
  }

  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}

function formatCost(value) {
  if (value === null || value === undefined) {
    return "N/A";
  }

  return value.toFixed(3);
}

function RouteMetricsTable({ metrics = [], onSelect }) {
  return (
    <section className="rounded-md border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Weekly Route Metrics
          </h2>

          <p className="text-xs text-slate-500">
            Route cost comparison
          </p>
        </div>

        <span className="text-xs text-slate-500">
          {metrics.length} records
        </span>
      </div>

      {metrics.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-sm font-medium text-slate-700">
            No route metrics available
          </p>

          <p className="mt-1 text-xs text-slate-500">
            No records match the selected filters.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-xs font-medium text-slate-500">
                  Route
                </th>

                <th className="px-4 py-3 text-xs font-medium text-slate-500">
                  Week
                </th>

                <th className="px-4 py-3 text-xs font-medium text-slate-500">
                  Cost / Tonne-Km
                </th>

                <th className="px-4 py-3 text-xs font-medium text-slate-500">
                  Own History
                </th>

                <th className="px-4 py-3 text-xs font-medium text-slate-500">
                  Similar Routes
                </th>

                <th className="px-4 py-3 text-xs font-medium text-slate-500">
                  Status
                </th>

                <th className="px-4 py-3 text-xs font-medium text-slate-500">
                  Note
                </th>
              </tr>
            </thead>

            <tbody>
              {metrics.map((metric) => (
                <tr
                  key={`${metric.route}-${metric.week_of}`}
                  onClick={() => onSelect?.(metric)}
                  className="cursor-pointer border-b border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">
                    {metric.route}
                  </td>

                  <td className="px-4 py-3 text-sm text-slate-500">
                    {metric.week_of}
                  </td>

                  <td className="px-4 py-3 text-sm text-slate-700">
                    {formatCost(metric.cost_per_tonne_km)}
                  </td>

                  <td className="px-4 py-3 text-sm">
                    <span
                      className={
                        metric.vs_own_history > 20
                          ? "font-medium text-red-600"
                          : "text-slate-600"
                      }
                    >
                      {formatPercentage(metric.vs_own_history)}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-sm">
                    <span
                      className={
                        metric.vs_similar_routes > 20
                          ? "font-medium text-red-600"
                          : "text-slate-600"
                      }
                    >
                      {formatPercentage(metric.vs_similar_routes)}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    {metric.flagged ? (
                      <span className="text-xs font-medium text-red-600">
                        Flagged
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-green-600">
                        Normal
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {metric.matched_note_id ? (
                      <span className="text-xs font-medium text-blue-600">
                        {metric.matched_note_id}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">
                        No note
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default RouteMetricsTable;