const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");

const notesFile = path.join(__dirname, "../../../data/context_notes.csv");

function loadContextNotes() {
  const file = fs.readFileSync(notesFile, "utf-8");

  return parse(file, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });
}

function isNoteApplicable(note, route, weekOf) {
  const routeMatches =
    note.route === "All Routes" || note.route === route;

  const startDate = new Date(note.start_date);
  const endDate = new Date(note.end_date);
  const weekDate = new Date(weekOf);

  return routeMatches && weekDate >= startDate && weekDate <= endDate;
}

function matchContextNote(routeMetric, contextNotes) {
  if (!routeMetric.flagged) {
    return {
      ...routeMetric,
      matched_note_id: null
    };
  }

  const matchingNotes = contextNotes.filter((note) =>
    isNoteApplicable(note, routeMetric.route, routeMetric.week_of)
  );

  if (!matchingNotes.length) {
    return {
      ...routeMetric,
      matched_note_id: null
    };
  }

  return {
    ...routeMetric,
    matched_note_id: matchingNotes[0].note_id
  };
}

function matchContextNotes(routeMetrics) {
  const contextNotes = loadContextNotes();

  return routeMetrics.map((routeMetric) =>
    matchContextNote(routeMetric, contextNotes)
  );
}

module.exports = {
  loadContextNotes,
  matchContextNote,
  matchContextNotes
};