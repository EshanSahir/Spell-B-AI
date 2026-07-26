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

// Helper for calling Gemini with model fallback and retry logic
async function generateWithRetry(ai: GoogleGenAI, params: any, fallbackModel = "gemini-flash-latest", maxRetries = 1) {
  const primaryModel = params.model || "gemini-3.6-flash";
  const modelsToTry = [primaryModel, fallbackModel].filter((m, i, self) => m && self.indexOf(m) === i);

  for (const model of modelsToTry) {
    let delay = 1000;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await ai.models.generateContent({
          ...params,
          model,
        });
      } catch (err: any) {
        const errStr = typeof err?.message === "string" ? err.message : JSON.stringify(err || "");
        const isQuotaOrBusy =
          err?.status === 503 || err?.code === 503 ||
          err?.status === 429 || err?.code === 429 ||
          errStr.includes("429") || errStr.includes("503") ||
          errStr.includes("RESOURCE_EXHAUSTED") || errStr.includes("quota") || errStr.includes("rate-limits");

        if (isQuotaOrBusy && attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 1.5;
        } else if (isQuotaOrBusy && model !== modelsToTry[modelsToTry.length - 1]) {
          console.warn(`[Gemini AI] Model ${model} rate-limited or busy. Trying fallback model ${fallbackModel}...`);
          break; // Try next model
        } else {
          throw err;
        }
      }
    }
  }
  throw new Error("All Gemini models are temporarily busy or at capacity.");
}

// Fallback Word List Generator for when AI rate limits are reached
function generateFallbackWordList(topic: string, difficulty: string, count: number) {
  const pool = [
    { word: "acquiesce", phonetic: "/ˌæk.wiˈɛs/", definition: "To accept something reluctantly but without protest.", partOfSpeech: "verb", origin: "Latin / French", sampleSentence: "She refused to acquiesce to the unfair demands.", syllables: "ac·qui·esce", mnemonic: "Notice 'qui' like quiet in acquiesce." },
    { word: "bourgeoisie", phonetic: "/ˌbʊər.ʒwɑːˈziː/", definition: "The middle class, typically with reference to its perceived materialistic values.", partOfSpeech: "noun", origin: "French", sampleSentence: "The economic growth expanded the town's bourgeoisie.", syllables: "bour·geoi·sie", mnemonic: "Remember 'geoi' after 'bour' in French." },
    { word: "chrysanthemum", phonetic: "/krɪˈsæn.θə.məm/", definition: "A plant of the daisy family with brightly colored flowers.", partOfSpeech: "noun", origin: "Greek", sampleSentence: "The garden was filled with yellow chrysanthemums.", syllables: "chrys·an·the·mum", mnemonic: "Greek 'chrys' means golden, 'anthem' means flower." },
    { word: "deleterious", phonetic: "/ˌdɛl.ɪˈtɪər.i.əs/", definition: "Causing harm or damage.", partOfSpeech: "adjective", origin: "Greek", sampleSentence: "Smoking has deleterious effects on long-term health.", syllables: "del·e·te·ri·ous", mnemonic: "Deleterious deletes your good health." },
    { word: "euphemism", phonetic: "/ˈjuː.fə.mɪz.əm/", definition: "A mild word substituted for one considered too harsh.", partOfSpeech: "noun", origin: "Greek", sampleSentence: "'Passed away' is a gentle euphemism for died.", syllables: "eu·phe·mism", mnemonic: "Greek 'eu' means good, 'pheme' means speech." },
    { word: "fictitious", phonetic: "/fɪkˈtɪʃ.əs/", definition: "Not real or true; imaginary or fabricated.", partOfSpeech: "adjective", origin: "Latin", sampleSentence: "He registered under a fictitious name.", syllables: "fic·ti·tious", mnemonic: "Contains 'tious' suffix common in Latin adjectives." },
    { word: "garrulous", phonetic: "/ˈɡær.əl.əs/", definition: "Excessively talkative, especially on trivial matters.", partOfSpeech: "adjective", origin: "Latin", sampleSentence: "The garrulous driver narrated his life story.", syllables: "gar·ru·lous", mnemonic: "Double 'r' in garrulous." },
    { word: "hierarchy", phonetic: "/ˈhaɪ.ər.ɑː.ki/", definition: "A system in which members are ranked according to status.", partOfSpeech: "noun", origin: "Greek", sampleSentence: "The company structure has a clear hierarchy.", syllables: "hi·er·ar·chy", mnemonic: "Remember 'h-i-e-r' before 'archy'." },
    { word: "idiosyncrasy", phonetic: "/ˌɪd.i.əˈsɪŋ.krə.si/", definition: "A mode of behavior peculiar to an individual.", partOfSpeech: "noun", origin: "Greek", sampleSentence: "One of his idiosyncrasies was drinking tea with a straw.", syllables: "id·i·o·syn·cra·sy", mnemonic: "Ends in 'crasy' with an 's', not 'cracy'." },
    { word: "juxtaposition", phonetic: "/ˌdʒʌk.stə.pəˈzɪʃ.ən/", definition: "The fact of two things being placed close together with contrasting effect.", partOfSpeech: "noun", origin: "Latin", sampleSentence: "The juxtaposition of modern art in an ancient room was striking.", syllables: "jux·ta·po·si·tion", mnemonic: "Latin 'juxta' means next to." },
    { word: "kaleidoscope", phonetic: "/kəˈlaɪ.də.skoʊp/", definition: "A constantly changing pattern or sequence of elements.", partOfSpeech: "noun", origin: "Greek", sampleSentence: "The festival was a kaleidoscope of bright colors.", syllables: "ka·lei·do·scope", mnemonic: "Greek 'kalos' (beautiful) + 'eidos' (form)." },
    { word: "labyrinthine", phonetic: "/ˌlæb.əˈrɪn.θɪn/", definition: "Intricate and confusing like a labyrinth.", partOfSpeech: "adjective", origin: "Greek", sampleSentence: "We navigated the labyrinthine alleyways of Old Venice.", syllables: "lab·y·rin·thine", mnemonic: "Remember 'y' then 'i' in labyrinth." }
  ];

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const selectedWords = shuffled.slice(0, Math.min(count, pool.length));

  return {
    id: `ai-${Date.now()}`,
    title: `${topic} (${difficulty.toUpperCase()})`,
    description: `Curated competition list focusing on ${topic}.`,
    difficulty: difficulty,
    category: topic,
    isCustom: true,
    words: selectedWords.map((w, idx) => ({
      id: `ai-word-${Date.now()}-${idx}`,
      word: w.word,
      phonetic: w.phonetic,
      definition: w.definition,
      partOfSpeech: w.partOfSpeech,
      origin: w.origin,
      sampleSentence: w.sampleSentence,
      syllables: w.syllables,
      difficulty: difficulty,
      mnemonic: w.mnemonic,
    })),
  };
}

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

    const response = await generateWithRetry(ai, {
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
    const topic = req.body?.topic || "Spelling Bee";
    const difficulty = req.body?.difficulty || "intermediate";
    const count = req.body?.count || 5;
    console.warn(`[Gemini AI] Wordlist generator fallback engaged for "${topic}".`);
    const fallbackList = generateFallbackWordList(topic, difficulty, count);
    return res.json({ wordList: fallbackList, isFallback: true });
  }
});

// 3. Get AI Spelling Analysis & Feedback for mistakes
app.post("/api/ai-spelling-advice", async (req, res) => {
  const { targetWord = "", userAttempt = "", origin = "Unknown", definition = "" } = req.body;

  if (!targetWord || !userAttempt) {
    return res.status(400).json({ error: "targetWord and userAttempt are required." });
  }

  try {
    const ai = getGeminiAI();

    const prompt = `The user tried to spell the Spelling Bee word: "${targetWord}"
User's attempt: "${userAttempt}"
Language of Origin: ${origin}
Definition: ${definition}

Provide a friendly, highly educational 2-3 sentence analysis explaining:
1. Exactly where the mistake occurred (e.g. silent letter omitted, wrong vowel sound, French ending vs English sound).
2. The root origin or etymology rule that explains why "${targetWord}" is spelled this way.
3. A quick, catchy mnemonic device to remember the correct spelling forever.`;

    const response = await generateWithRetry(ai, {
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an encouraging Spelling Bee coach providing precise, constructive etymological feedback.",
      },
    });

    return res.json({ explanation: response.text });
  } catch (err: any) {
    console.warn(`[Gemini AI] Advice fallback engaged for word "${targetWord}".`);

    // Provide a smart, graceful etymological fallback explanation so the UI remains smooth
    const fallbackAdvice = `The target word "${targetWord}" (meaning: ${definition || "dictionary term"}) originates from ${origin}. When practicing ${origin} root words, pay close attention to vowel combinations and silent letters. Re-read the phonetic guide and review the correct spelling: "${targetWord.toUpperCase()}".`;

    return res.json({ explanation: fallbackAdvice, isFallback: true });
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

    const response = await generateWithRetry(ai, {
      model: "gemini-3.6-flash",
      contents: formattedPrompt,
      config: {
        systemInstruction: "You are the AI Spelling Bee Champion Coach. Help the student master spelling rules, Latin & Greek roots, French/German loanwords, prefixes/suffixes, and test-taking strategies. Keep responses enthusiastic, clear, structured, and easy to read.",
      },
    });

    return res.json({ reply: response.text });
  } catch (err: any) {
    console.warn("Notice: AI Chat error, using graceful response:", err?.message || err);
    return res.json({
      reply: "The AI Coach server is currently experiencing high demand. Please wait a moment and send your question again, or practice with the current Word Libraries in the meantime!",
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
