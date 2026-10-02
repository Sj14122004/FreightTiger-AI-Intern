import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Filters from "../components/Dashboard/Filters";
import RouteMetricsTable from "../components/Dashboard/RouteMetricsTable";
import MetricDetails from "../components/Dashboard/MetricDetails";
import LlmUsageCard from "../components/Dashboard/LlmUsageCard";
import {
  generateRouteAnalysis,
  getFinalOutputDownloadUrl
} from "../services/api";

function Generate() {
  const [metrics, setMetrics] = useState([]);
  const [llmUsage, setLlmUsage] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    route: "",
    routeType: "",
    week: "",
    status: "all"
  });

  async function handleGenerate() {
    try {
      setLoading(true);
      setError("");

      const response = await generateRouteAnalysis();

      setMetrics(response.data?.rows || []);
      setLlmUsage(response.data?.llmUsage || null);
      setGenerated(true);
    } catch (err) {
      setError(err.message || "Failed to generate analysis");
    } finally {
      setLoading(false);
    }
  }

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

  function handleDownload() {
    window.open(
      getFinalOutputDownloadUrl(),
      "_blank",
      "noopener,noreferrer"
    );
  }

  const filteredMetrics = useMemo(() => {
    return metrics.filter((metric) => {
      const matchesRoute =
        !filters.route || metric.route === filters.route;

      const matchesRouteType =
        !filters.routeType ||
        metric.route_type === filters.routeType;

      const matchesWeek =
        !filters.week || metric.week_of === filters.week;

      const matchesStatus =
        filters.status === "all" ||
        (filters.status === "flagged" && metric.flagged) ||
        (filters.status === "normal" && !metric.flagged);

      return (
        matchesRoute &&
        matchesRouteType &&
        matchesWeek &&
        matchesStatus
      );
    });
  }, [metrics, filters]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              AI Analysis
            </p>

            <h1 className="mt-1 text-2xl font-semibold text-slate-900">
              Generate Analysis
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Generate route explanations using verified context notes.
            </p>
          </div>

          <div className="flex gap-2">
            {generated && (
              <button
                type="button"
                onClick={handleDownload}
                className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Download CSV
              </button>
            )}

            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Generating..." : "Generate Analysis"}
            </button>
          </div>
        </div>

        {generated && (
          <>
            <div className="mb-4">
              <LlmUsageCard usage={llmUsage} />
            </div>

            <Filters
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </>
        )}

        {loading && (
          <section className="flex min-h-80 items-center justify-center rounded-lg border border-slate-200 bg-white">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-700" />

              <p className="mt-3 text-sm text-slate-500">
                Searching notes and generating AI feedback...
              </p>
            </div>
          </section>
        )}

        {!loading && error && (
          <section className="rounded-lg border border-red-200 bg-red-50 p-5">
            <p className="text-sm font-semibold text-red-700">
              Analysis failed
            </p>

            <p className="mt-1 text-sm text-red-600">
              {error}
            </p>
          </section>
        )}

        {!loading && !error && !generated && (
          <section className="flex min-h-80 items-center justify-center rounded-lg border border-slate-200 bg-white">
            <div className="text-center">
              <p className="text-base font-semibold text-slate-800">
                Ready to generate
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Click Generate Analysis to find verified notes and generate AI feedback.
              </p>
            </div>
          </section>
        )}

        {!loading && !error && generated && (
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

export default Generate;