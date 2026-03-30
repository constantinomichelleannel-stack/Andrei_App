import { GoogleGenAI } from "@google/genai";

const getAI = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("GEMINI_API_KEY is not defined. Please add it in the Settings > Secrets menu.");
  }
  return new GoogleGenAI({ apiKey: key });
};

export const getLegalAssistant = (prompt: string) => {
  const ai = getAI();
  return ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: `You are LexPH, an Agentic AI Legal Research Assistant for Philippine Law. 
      Your goal is to automate complex legal research workflows.
      When asked a question:
      1. Analyze the legal issues involved.
      2. Identify relevant statutes (Constitution, Civil Code, etc.).
      3. Search for landmark and recent Supreme Court jurisprudence.
      4. Synthesize a comprehensive legal opinion or memorandum.
      
      Always cite specific G.R. Numbers and Article numbers. 
      Maintain a professional, precise, and authoritative tone for private legal practice.`,
    }
  });
};

export const predictCaseOutcome = async (facts: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `As a legal predictive analytics tool for Philippine Law, analyze the following case facts and predict the likely outcome based on current jurisprudence and legal principles. 
    Provide:
    1. Probability of Success (Percentage)
    2. Key Legal Strengths
    3. Potential Risks/Weaknesses
    4. Recommended Strategy
    
    Case Facts: ${facts}`,
  });
  return response.text;
};

export const analyzeJurisprudenceTrends = async (topic: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the recent trends in Philippine Supreme Court jurisprudence regarding: ${topic}.
    Discuss how the Court's stance has evolved over the last 10 years and what private practitioners should expect in future rulings.`,
  });
  return response.text;
};
