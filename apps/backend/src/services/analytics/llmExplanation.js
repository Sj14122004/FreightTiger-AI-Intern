async function generateLlmExplanation(note) {
  const startTime = Date.now();

  try {
    const response = await fetch(
      "http://localhost:11434/api/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama3.2:latest",
          prompt:
            `Summarize this verified context note as a concise reason for a freight cost anomaly. ` +
            `Use only the note. Do not add facts.\n\n` +
            note,
          stream: false,
          options: {
            temperature: 0
          }
        })
      }
    );

    const durationMs = Date.now() - startTime;

    if (!response.ok) {
      return {
        explanation: "Unexplained",
        usage: {
          promptTokens: 0,
          outputTokens: 0,
          totalTokens: 0,
          durationMs
        }
      };
    }

    const data = await response.json();

    const promptTokens = data.prompt_eval_count || 0;
    const outputTokens = data.eval_count || 0;

    return {
      explanation: data.response?.trim() || "Unexplained",
      usage: {
        promptTokens,
        outputTokens,
        totalTokens: promptTokens + outputTokens,
        durationMs
      }
    };
  } catch (error) {
    const durationMs = Date.now() - startTime;

    console.error("LLM explanation failed");

    return {
      explanation: "Unexplained",
      usage: {
        promptTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
        durationMs
      }
    };
  }
}

module.exports = {
  generateLlmExplanation
};