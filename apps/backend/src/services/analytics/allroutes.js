const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");

const shipmentFile = path.join(__dirname, "../../../data/shipment_records.csv");

function getWeekMonday(date) {
  const day = date.getDay();
  const difference = day === 0 ? -6 : 1 - day;
  const monday = new Date(date);

  monday.setDate(date.getDate() + difference);

  return monday.toISOString().split("T")[0];
}

function loadAllRoutes() {
  const file = fs.readFileSync(shipmentFile, "utf-8");

  const shipments = parse(file, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });

  return shipments.map((shipment) => ({
    ...shipment,
    quantity_tonnes: Number(shipment.quantity_tonnes),
    distance_km: Number(shipment.distance_km),
    freight_cost_inr: Number(shipment.freight_cost_inr),
    route: `${shipment.origin}-${shipment.destination}`,
    week_of: getWeekMonday(new Date(shipment.shipment_date))
  }));
}

function calculateAllRoutesMetrics(shipments) {
  const groups = new Map();

  for (const shipment of shipments) {
    const key = `${shipment.route}|${shipment.route_type}|${shipment.week_of}`;

    if (!groups.has(key)) {
      groups.set(key, {
        route: shipment.route,
        route_type: shipment.route_type,
        week_of: shipment.week_of,
        total_freight_cost: 0,
        total_tonne_km: 0
      });
    }

    const group = groups.get(key);

    group.total_freight_cost += shipment.freight_cost_inr;
    group.total_tonne_km += shipment.quantity_tonnes * shipment.distance_km;
  }

  return Array.from(groups.values())
    .map((group) => ({
      ...group,
      cost_per_tonne_km:
        group.total_freight_cost / group.total_tonne_km
    }))
    .sort((a, b) => {
      if (a.route !== b.route) {
        return a.route.localeCompare(b.route);
      }

      return a.week_of.localeCompare(b.week_of);
    });
}

module.exports = {
  loadAllRoutes,
  calculateAllRoutesMetrics
};