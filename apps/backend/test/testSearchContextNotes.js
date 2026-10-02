const {
  searchContextNotes
} = require("../src/services/analytics/contextNoteRag");

async function run() {
  try {
    const query =
      "Chennai-Bangalore flooding higher trip costs February 2025";

    console.log("Searching context notes...");
    console.log(`Query: ${query}`);

    const results = await searchContextNotes(query, 3);

    console.log("\nSearch results:");

    results.forEach((result, index) => {
      console.log(`\nResult ${index + 1}`);
      console.log(`Note ID: ${result.note_id}`);
      console.log(`Distance: ${result.distance}`);
      console.log(`Metadata:`, result.metadata);
      console.log(`Document:\n${result.document}`);
    });
  } catch (error) {
    console.error("Context note search failed");
    console.error(error);
    process.exit(1);
  }
}

run();