function LlmUsageCard({ usage }) {
  if (!usage) {
    return null;
  }

  const {
    model = "N/A",
    calls = 0,
    promptTokens = 0,
    outputTokens = 0,
    totalTokens = 0,
    cost = 0,
    durationMs = 0
  } = usage;

  const stats = [
    {
      label: "LLM Calls",
      value: calls
    },
    {
      label: "Prompt Tokens",
      value: promptTokens
    },
    {
      label: "Output Tokens",
      value: outputTokens
    },
    {
      label: "Total Tokens",
      value: totalTokens
    },
    {
      label: "Cost",
      value: `$${cost.toFixed(4)}`
    },
    {
      label: "Time",
      value: `${(durationMs / 1000).toFixed(2)}s`
    }
  ];

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          LLM Usage
        </p>

        <h2 className="mt-1 text-lg font-semibold text-slate-900">
          Token & Cost Summary
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Usage recorded during the latest analysis run.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-md border border-slate-200 p-3"
          >
            <p className="text-xs text-slate-500">
              {stat.label}
            </p>

            <p className="mt-1 text-lg font-semibold text-slate-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 text-xs text-slate-500">
        Model: <span className="font-medium text-slate-700">{model}</span>
      </div>
    </section>
  );
}

export default LlmUsageCard;