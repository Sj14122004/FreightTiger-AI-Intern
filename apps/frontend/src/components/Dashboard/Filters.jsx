function Filters({ filters, onChange, onReset }) {
  const routes = [
    "Mumbai-Pune",
    "Delhi-Jaipur",
    "Chennai-Bangalore",
    "Ahmedabad-Mumbai",
    "Kolkata-Bhubaneswar",
    "Mumbai-Delhi",
    "Delhi-Chennai"
  ];

  return (
    <section className="mb-4 rounded-lg border border-slate-200 bg-white p-3">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
        <select
          value={filters.route}
          onChange={(event) =>
            onChange("route", event.target.value)
          }
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-400"
        >
          <option value="">All Routes</option>

          {routes.map((route) => (
            <option key={route} value={route}>
              {route}
            </option>
          ))}
        </select>

        <select
          value={filters.routeType}
          onChange={(event) =>
            onChange("routeType", event.target.value)
          }
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-400"
        >
          <option value="">All Types</option>
          <option value="Short">Short</option>
          <option value="Medium">Medium</option>
          <option value="Long">Long</option>
        </select>

        <input
          type="date"
          value={filters.week}
          onChange={(event) =>
            onChange("week", event.target.value)
          }
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-400"
        />

        <select
          value={filters.status}
          onChange={(event) =>
            onChange("status", event.target.value)
          }
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-400"
        >
          <option value="all">All Records</option>
          <option value="flagged">Flagged Only</option>
          <option value="normal">Normal Only</option>
        </select>

        <button
          type="button"
          onClick={onReset}
          className="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          Reset
        </button>
      </div>
    </section>
  );
}

export default Filters;