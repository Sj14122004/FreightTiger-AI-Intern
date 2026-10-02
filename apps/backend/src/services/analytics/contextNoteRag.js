const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");
const { ChromaClient } = require("chromadb");
const { pipeline } = require("@xenova/transformers");

const notesFile = path.join(__dirname, "../../../data/context_notes.csv");

const chromaClient = new ChromaClient({
  host: "localhost",
  port: 8000
});

const COLLECTION_NAME = "freightiger_context_notes";
const EMBEDDING_MODEL = "Xenova/all-MiniLM-L6-v2";

let embeddingPipeline = null;

async function getEmbeddingPipeline() {
  if (!embeddingPipeline) {
    console.log("Loading embedding model...");

    embeddingPipeline = await pipeline(
      "feature-extraction",
      EMBEDDING_MODEL
    );

    console.log("Embedding model loaded");
  }

  return embeddingPipeline;
}

function loadContextNotesForRag() {
  const file = fs.readFileSync(notesFile, "utf-8");

  return parse(file, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });
}

function createNoteDocument(note) {
  return [
    `Note ID: ${note.note_id}`,
    `Date: ${note.date}`,
    `Applies to: ${note.applies_to}`,
    `Note: ${note.note}`
  ].join("\n");
}

async function createEmbedding(text) {
  const extractor = await getEmbeddingPipeline();

  const output = await extractor(text, {
    pooling: "mean",
    normalize: true
  });

  return Array.from(output.data);
}

class XenovaEmbeddingFunction {
  async generate(texts) {
    const embeddings = [];

    for (const text of texts) {
      embeddings.push(await createEmbedding(text));
    }

    return embeddings;
  }
}

const embeddingFunction = new XenovaEmbeddingFunction();

async function createContextNoteCollection() {
  try {
    return await chromaClient.getCollection({
      name: COLLECTION_NAME,
      embeddingFunction
    });
  } catch (error) {
    return await chromaClient.createCollection({
      name: COLLECTION_NAME,
      embeddingFunction
    });
  }
}

async function indexContextNotes() {
  const notes = loadContextNotesForRag();

  console.log(`Found ${notes.length} context notes`);

  const collection = await createContextNoteCollection();
  const documents = notes.map(createNoteDocument);

  console.log("Creating embeddings using Xenova...");

  const embeddings = await embeddingFunction.generate(documents);

  await collection.upsert({
    ids: notes.map((note) => note.note_id),
    documents,
    embeddings,
    metadatas: notes.map((note) => ({
      note_id: note.note_id,
      date: note.date,
      applies_to: note.applies_to
    }))
  });

  return {
    indexed_count: notes.length
  };
}

async function searchContextNotes(query, limit = 3) {
  const collection = await createContextNoteCollection();
  const queryEmbedding = await createEmbedding(query);

  const results = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: limit
  });

  return (
    results.ids?.[0]?.map((id, index) => ({
      note_id: id,
      document: results.documents?.[0]?.[index] || "",
      metadata: results.metadatas?.[0]?.[index] || {},
      distance: results.distances?.[0]?.[index] ?? null
    })) || []
  );
}

module.exports = {
  loadContextNotesForRag,
  createNoteDocument,
  createEmbedding,
  createContextNoteCollection,
  indexContextNotes,
  searchContextNotes
};