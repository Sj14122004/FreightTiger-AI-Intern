const {
  searchContextNotes
} = require("../src/services/analytics/contextNoteRag");

const {
  findVerifiedContextNote
} = require("../src/services/analytics/contextNoteValidation");

async function run() {
  try {
    const route = "Chennai-Bangalore";
    const weekOf = "2025-02-24";
    const query =
      "Chennai-Bangalore flooding higher trip costs February 2025";

    console.log("Searching context notes...");

    const candidates = await searchContextNotes(query, 3);

    console.log(`Retrieved ${candidates.length} candidates`);

    const verifiedNote = findVerifiedContextNote(
      candidates,
      route,
      weekOf
    );

    if (!verifiedNote) {
      console.log("No verified context note found");
      return;
    }

    console.log("\nVerified context note:");
    console.log(`Note ID: ${verifiedNote.note_id}`);
    console.log(`Date: ${verifiedNote.date}`);
    console.log(`Route: ${verifiedNote.applies_to}`);
    console.log(`Note: ${verifiedNote.note}`);
  } catch (error) {
    console.error("Context note validation failed");
    console.error(error);
    process.exit(1);
  }
}

run();