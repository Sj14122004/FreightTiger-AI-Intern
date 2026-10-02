function formatPercentage(value) {
  if (value === null || value === undefined) {
    return "N/A";
  }

  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function MetricDetails({ metric, onClose }) {
  if (!metric) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-xl rounded-md border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {metric.route}
            </h2>

            <p className="text-sm text-slate-500">
              Week of {metric.week_of}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-lg text-slate-400 hover:text-slate-700"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="border border-slate-200 p-3">
              <p className="text-xs text-slate-500">
                Cost / Tonne-Km
              </p>

              <p className="mt-1 text-lg font-semibold text-slate-900">
                {metric.cost_per_tonne_km?.toFixed(3) || "N/A"}
              </p>
            </div>

            <div className="border border-slate-200 p-3">
              <p className="text-xs text-slate-500">
                Own History
              </p>

              <p
                className={`mt-1 text-lg font-semibold ${
                  metric.vs_own_history > 20
                    ? "text-red-600"
                    : "text-slate-900"
                }`}
              >
                {formatPercentage(metric.vs_own_history)}
              </p>
            </div>

            <div className="border border-slate-200 p-3">
              <p className="text-xs text-slate-500">
                Similar Routes
              </p>

              <p
                className={`mt-1 text-lg font-semibold ${
                  metric.vs_similar_routes > 20
                    ? "text-red-600"
                    : "text-slate-900"
                }`}
              >
                {formatPercentage(metric.vs_similar_routes)}
              </p>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold text-slate-500">
              Analysis Status
            </p>

            <div
              className={`border p-3 ${
                metric.flagged
                  ? "border-red-200 bg-red-50"
                  : "border-green-200 bg-green-50"
              }`}
            >
              <p
                className={`text-sm font-medium ${
                  metric.flagged
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {metric.flagged
                  ? "Unusual cost increase detected"
                  : "No unusual cost increase detected"}
              </p>

              <p className="mt-1 text-xs text-slate-600">
                {metric.flagged
                  ? "This route-week exceeded the configured anomaly threshold."
                  : "This route-week remains within the configured thresholds."}
              </p>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold text-slate-500">
              Context Evidence
            </p>

            <div className="border border-slate-200 p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700">
                  Matched Context Note
                </span>

                <span
                  className={
                    metric.matched_note_id
                      ? "text-xs font-medium text-blue-600"
                      : "text-xs text-slate-400"
                  }
                >
                  {metric.matched_note_id || "None"}
                </span>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {metric.reason || "Unexplained"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-200 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default MetricDetails;