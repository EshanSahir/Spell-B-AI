import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "2mb" }));

// Initialize Gemini SDK with telemetry header
const getGeminiAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// 1. Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 2. Generate Custom Word List with Gemini
app.post("/api/generate-wordlist", async (req, res) => {
  try {
    const { topic, difficulty, count = 5 } = req.body;
    
    if (!topic || !difficulty) {
      return res.status(400).json({ error: "Topic and difficulty are required." });
    }

    const ai = getGeminiAI();

    const prompt = `Generate a high-quality Spelling Bee word list for training.
Target Topic / Focus: ${topic}
Target Difficulty Level: ${difficulty} (Options: beginner, intermediate, advanced, championship)
Number of Words: ${count}

Each word MUST be accurate, challenging for its level, and include spelling bee competition metadata:
1. word: the target spelling word (lowercase)
2. phonetic: IPA or readable phonetic pronunciation, e.g. "/æk.wiˈɛs.ənt/"
3. definition: clear, concise dictionary definition
4. partOfSpeech: noun, verb, adjective, adverb, etc.
5. origin: language of origin (e.g., "Latin", "French", "Greek", "German", "Italian", "Japanese")
6. sampleSentence: a clean sentence using the word in proper context
7. syllables: dot-separated syllables, e.g. "ac·qui·es·cent"
8. mnemonic: a short memory trick or etymology tip to help remember how to spell it`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert Scripps National Spelling Bee official and etymologist crafting official competition word lists.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "A catchy list title" },
            description: { type: Type.STRING, description: "Brief overview of this word list" },
            category: { type: Type.STRING, description: "Category/Theme name" },
            words: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  phonetic: { type: Type.STRING },
                  definition: { type: Type.STRING },
                  partOfSpeech: { type: Type.STRING },
                  origin: { type: Type.STRING },
                  sampleSentence: { type: Type.STRING },
                  syllables: { type: Type.STRING },
                  mnemonic: { type: Type.STRING },
                },
                required: ["word", "phonetic", "definition", "partOfSpeech", "origin", "sampleSentence"],
              },
            },
          },
          required: ["title", "description", "category", "words"],
        },
      },
    });

    const jsonText = response.text || "{}";
    const data = JSON.parse(jsonText);

    // Attach unique IDs and ensure difficulty match
    const formattedList = {
      id: `ai-${Date.now()}`,
      title: data.title || `${topic} (${difficulty.toUpperCase()})`,
      description: data.description || `Custom AI-generated list focusing on ${topic}.`,
      difficulty: difficulty,
      category: data.category || topic,
      isCustom: true,
      words: (data.words || []).map((w: any, index: number) => ({
        id: `ai-word-${Date.now()}-${index}`,
        word: w.word.trim().toLowerCase(),
        phonetic: w.phonetic || "",
        definition: w.definition || "",
        partOfSpeech: w.partOfSpeech || "noun",
        origin: w.origin || "Unknown",
        sampleSentence: w.sampleSentence || "",
        syllables: w.syllables || w.word,
        difficulty: difficulty,
        mnemonic: w.mnemonic || "",
      })),
    };

    return res.json({ wordList: formattedList });
  } catch (err: any) {
    console.error("Error generating wordlist:", err);
    return res.status(500).json({
      error: "Failed to generate AI word list.",
      details: err.message || "Unknown error",
    });
  }
});

// 3. Get AI Spelling Analysis & Feedback for mistakes
app.post("/api/ai-spelling-advice", async (req, res) => {
  try {
    const { targetWord, userAttempt, origin, definition } = req.body;

    if (!targetWord || !userAttempt) {
      return res.status(400).json({ error: "targetWord and userAttempt are required." });
    }

    const ai = getGeminiAI();

    const prompt = `The user tried to spell the Spelling Bee word: "${targetWord}"
User's attempt: "${userAttempt}"
Language of Origin: ${origin || "Unknown"}
Definition: ${definition || "N/A"}

Provide a friendly, highly educational 2-3 sentence analysis explaining:
1. Exactly where the mistake occurred (e.g. silent letter omitted, wrong vowel sound, French ending vs English sound).
2. The root origin or etymology rule that explains why "${targetWord}" is spelled this way.
3. A quick, catchy mnemonic device to remember the correct spelling forever.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an encouraging Spelling Bee coach providing precise, constructive etymological feedback.",
      },
    });

    return res.json({ explanation: response.text });
  } catch (err: any) {
    console.error("Error generating spelling advice:", err);
    return res.status(500).json({
      error: "Failed to generate spelling advice.",
      details: err.message,
    });
  }
});

// 4. AI Coach Chat
app.post("/api/ai-chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const ai = getGeminiAI();

    // Format chat conversation
    const formattedPrompt = messages
      .map((m: any) => `${m.sender === "user" ? "User" : "Coach"}: ${m.text}`)
      .join("\n");

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: formattedPrompt,
      config: {
        systemInstruction: "You are the AI Spelling Bee Champion Coach. Help the student master spelling rules, Latin & Greek roots, French/German loanwords, prefixes/suffixes, and test-taking strategies. Keep responses enthusiastic, clear, structured, and easy to read.",
      },
    });

    return res.json({ reply: response.text });
  } catch (err: any) {
    console.error("Error in AI chat:", err);
    return res.status(500).json({
      error: "Failed to process AI chat message.",
      details: err.message,
    });
  }
});

// Serve frontend in dev or production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Spelling Bee AI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
