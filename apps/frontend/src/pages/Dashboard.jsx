import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import SummaryCards from "../components/Dashboard/SummaryCards";
import FlaggedRoutes from "../components/Dashboard/FlaggedRoutes";
import MetricDetails from "../components/Dashboard/MetricDetails";
import { fetchRouteMetrics } from "../services/api";

function Dashboard() {
  const [metrics, setMetrics] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const summary = useMemo(() => {
    const routes = new Set(
      metrics.map((metric) => metric.route)
    );

    const flagged = metrics.filter(
      (metric) => metric.flagged
    ).length;

    return {
      routeWeeks: metrics.length,
      flagged,
      routes: routes.size
    };
  }, [metrics]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Overview
          </p>

          <h1 className="mt-1 text-2xl font-semibold">
            Performance Summary
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Freight cost analytics across all monitored routes.
          </p>
        </header>

        <SummaryCards
          routeWeeks={summary.routeWeeks}
          flagged={summary.flagged}
          routes={summary.routes}
        />

        {loading && (
          <section className="mt-6 flex min-h-80 items-center justify-center rounded-lg border border-slate-200 bg-white">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-700" />

              <p className="mt-3 text-sm text-slate-500">
                Loading route analytics...
              </p>
            </div>
          </section>
        )}

        {!loading && error && (
          <section className="mt-6 rounded-lg border border-red-200 bg-red-50 p-5">
            <p className="text-sm font-semibold text-red-700">
              Unable to load route analytics
            </p>

            <p className="mt-1 text-sm text-red-600">
              {error}
            </p>
          </section>
        )}

        {!loading && !error && (
          <section className="mt-6">
            <FlaggedRoutes
              metrics={metrics}
              onSelect={setSelectedMetric}
            />
          </section>
        )}
      </main>

      <MetricDetails
        metric={selectedMetric}
        onClose={() => setSelectedMetric(null)}
      />
    </div>
  );
}

export default Dashboard;