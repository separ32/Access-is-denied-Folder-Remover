import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, Language } from "../types";

export const analyzePathSafety = async (path: string, lang: Language): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    return {
      isSafe: true,
      message: lang === 'en' ? "API Key not configured. Skipping AI analysis." : "کلید API تنظیم نشده است. تحلیل هوش مصنوعی نادیده گرفته شد.",
      riskLevel: "LOW"
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      You are a Windows System Administrator expert. 
      Analyze the following file path for safety before deletion: "${path}".
      
      Determine if deleting this path is:
      1. Safe (User documents, temp folders, downloads)
      2. Risky (Program files, unknown system files)
      3. Dangerous (Windows system folders, System32, root drives)

      Respond in JSON format only.
      Language: ${lang === 'fa' ? 'Persian (Farsi)' : 'English'}.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isSafe: { type: Type.BOOLEAN },
            message: { type: Type.STRING, description: `A short explanation in ${lang === 'fa' ? 'Persian' : 'English'}` },
            riskLevel: { type: Type.STRING, enum: ["LOW", "MEDIUM", "HIGH"] }
          },
          required: ["isSafe", "message", "riskLevel"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    }
    
    throw new Error("Empty response");

  } catch (error) {
    console.error("AI Analysis failed:", error);
    return {
      isSafe: true,
      message: lang === 'en' ? "Error communicating with AI. Please check manually." : "خطا در ارتباط با هوش مصنوعی. لطفا خودتان بررسی کنید.",
      riskLevel: "LOW"
    };
  }
};