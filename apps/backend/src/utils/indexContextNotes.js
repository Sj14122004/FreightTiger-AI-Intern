const {
  indexContextNotes
} = require("../services/analytics/contextNoteRag");

async function run() {
  try {
    console.log("Starting context note indexing...");

    const result = await indexContextNotes();

    console.log("Context notes indexed successfully");
    console.log(`Indexed count: ${result.indexed_count}`);
  } catch (error) {
    console.error("Context note indexing failed");
    console.error(error);
    process.exit(1);
  }
}

run();