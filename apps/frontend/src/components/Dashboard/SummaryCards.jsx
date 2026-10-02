function SummaryCards({ routeWeeks = 0, flagged = 0, routes = 0 }) {
  const summary = [
    {
      label: "Route-Weeks",
      value: routeWeeks,
      description: "Weekly route records"
    },
    {
      label: "Flagged",
      value: flagged,
      description: "Unusual cost increases",
      flagged: true
    },
    {
      label: "Routes",
      value: routes,
      description: "Routes being monitored"
    },
    {
      label: "Analysis Period",
      value: "2024–25",
      description: "Historical shipment data"
    }
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {summary.map((item) => (
        <div
          key={item.label}
          className="rounded-lg border border-slate-200 bg-white p-5"
        >
          <p className="text-sm font-medium text-slate-500">
            {item.label}
          </p>

          <p
            className={`mt-3 text-2xl font-semibold ${
              item.flagged ? "text-red-600" : "text-slate-900"
            }`}
          >
            {item.value}
          </p>

          <p className="mt-2 text-xs text-slate-400">
            {item.description}
          </p>
        </div>
      ))}
    </section>
  );
}

export default SummaryCards;