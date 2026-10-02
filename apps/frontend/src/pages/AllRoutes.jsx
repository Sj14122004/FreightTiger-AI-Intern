import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import RouteMetricsTable from "../components/Dashboard/RouteMetricsTable";
import MetricDetails from "../components/Dashboard/MetricDetails";
import Filters from "../components/Dashboard/Filters";
import { fetchRouteMetrics } from "../services/api";

function AllRoutes() {
  const [metrics, setMetrics] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    route: "",
    routeType: "",
    week: "",
    status: "all"
  });

  useEffect(() => {
    async function loadMetrics() {
      try {
        setLoading(true);
        setError("");
        const data = await fetchRouteMetrics();
        setMetrics(data.data || []);
      } catch (err) {
        setError(err.message || "Failed to load route metrics");
      } finally {
        setLoading(false);
      }
    }

    loadMetrics();
  }, []);

  function handleFilterChange(field, value) {
    setFilters((current) => ({
      ...current,
      [field]: value
    }));
  }

  function handleResetFilters() {
    setFilters({
      route: "",
      routeType: "",
      week: "",
      status: "all"
    });
  }

  const filteredMetrics = useMemo(() => {
    return metrics.filter((metric) => {
      const matchesRoute = !filters.route || metric.route === filters.route;
      const matchesRouteType = !filters.routeType || metric.route_type === filters.routeType;
      const matchesWeek = !filters.week || metric.week_of === filters.week;
      const matchesStatus =
        filters.status === "all" ||
        (filters.status === "flagged" && metric.flagged) ||
        (filters.status === "normal" && !metric.flagged);

      return matchesRoute && matchesRouteType && matchesWeek && matchesStatus;
    });
  }, [metrics, filters]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-[1600px] px-5 py-8 lg:px-8 lg:py-10">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Analytics</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">All Routes</h1>
          <p className="mt-1 text-sm text-slate-500">Explore all weekly route metrics from the analytics dataset.</p>
        </div>
        <Filters
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
        />
        {loading && (
          <section className="flex min-h-[400px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <div className="text-center">
              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />
              <p className="mt-4 text-sm font-medium text-slate-500">Loading route analytics...</p>
            </div>
          </section>
        )}
        {!loading && error && (
          <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm font-semibold text-red-800">Unable to load route analytics</p>
            <p className="mt-1 text-sm text-red-600">{error}</p>
          </section>
        )}
        {!loading && !error && (
          <RouteMetricsTable
            metrics={filteredMetrics}
            onSelect={setSelectedMetric}
          />
        )}
      </main>
      <MetricDetails
        metric={selectedMetric}
        onClose={() => setSelectedMetric(null)}
      />
    </div>
  );
}

export default AllRoutes;