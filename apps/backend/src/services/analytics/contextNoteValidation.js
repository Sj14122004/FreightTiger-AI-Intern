function normalizeDate(date) {
  return new Date(`${date}T00:00:00`);
}

function routeMatches(note, route) {
  return (
    note.applies_to === "All Routes" ||
    note.applies_to === route
  );
}

function getApplicableDateRange(note) {
  const noteDate = normalizeDate(note.date);
  const rangeMatch = note.note.match(
    /from\s+([A-Za-z]+\s+\d{1,2})\s+to\s+([A-Za-z]+\s+\d{1,2})/i
  );

  if (!rangeMatch) {
    return {
      startDate: noteDate,
      endDate: noteDate
    };
  }

  const startDate = new Date(`${rangeMatch[1]}, ${noteDate.getFullYear()}`);
  let endDate = new Date(`${rangeMatch[2]}, ${noteDate.getFullYear()}`);

  if (endDate < startDate) {
    endDate.setFullYear(endDate.getFullYear() + 1);
  }

  return {
    startDate,
    endDate
  };
}

function dateMatches(note, weekOf) {
  const weekDate = normalizeDate(weekOf);
  const { startDate, endDate } = getApplicableDateRange(note);

  return weekDate >= startDate && weekDate <= endDate;
}

function validateContextNote(note, route, weekOf) {
  return (
    routeMatches(note, route) &&
    dateMatches(note, weekOf)
  );
}

function findVerifiedContextNote(candidates, route, weekOf) {
  for (const candidate of candidates) {
    const note = {
      note_id: candidate.metadata.note_id,
      date: candidate.metadata.date,
      applies_to: candidate.metadata.applies_to,
      note: extractNoteText(candidate.document)
    };

    if (validateContextNote(note, route, weekOf)) {
      return note;
    }
  }

  return null;
}

function extractNoteText(document) {
  const match = document.match(/^Note:\s*(.*)$/m);

  return match ? match[1].trim() : "";
}

module.exports = {
  routeMatches,
  dateMatches,
  validateContextNote,
  findVerifiedContextNote
};