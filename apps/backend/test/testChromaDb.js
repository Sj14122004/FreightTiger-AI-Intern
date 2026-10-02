const { ChromaClient } = require("chromadb");

const chromaClient = new ChromaClient({
  host: "localhost",
  port: 8000
});
async function testChromaDb() {
  try {
    const collection = await chromaClient.getOrCreateCollection({
      name: "freightiger_test"
    });

    console.log("ChromaDB connected successfully");
    console.log("Collection:", collection.name);
  } catch (error) {
    console.error("ChromaDB connection failed:", error.message);
  }
}

testChromaDb();