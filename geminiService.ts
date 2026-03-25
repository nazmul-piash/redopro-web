import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { GroundingResult } from "./types";

// Safe initialization
const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "undefined") {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export interface ClassificationResult {
  name: string;
  category: string;
  estimatedPoints: number;
  description: string;
}

/**
 * Classifies an e-waste item from an image
 */
export const classifyEWaste = async (base64Image: string): Promise<ClassificationResult> => {
  const ai = getAIClient();
  if (!ai) throw new Error("API Key not configured. Please check your environment.");

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image.split(',')[1] || base64Image
            }
          },
          {
            text: "Identify this electronic waste. Provide the name, category, point value (10-500), and a brief description in JSON format."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            category: { type: Type.STRING },
            estimatedPoints: { type: Type.NUMBER },
            description: { type: Type.STRING }
          },
          required: ["name", "category", "estimatedPoints", "description"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No identification data received.");
    return JSON.parse(text.trim());
  } catch (error) {
    console.error("AI Error:", error);
    throw new Error("Recognition failed. Please try again.");
  }
};

/**
 * Finds local recycling centers using Google Maps grounding
 */
export const findRecyclingCenters = async (query: string, lat?: number, lng?: number): Promise<GroundingResult> => {
  const ai = getAIClient();
  if (!ai) throw new Error("API Key not configured.");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find recycling centers or drop-off points for: ${query}. Be specific to the current area if coordinates are provided.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: (lat && lng) ? { latitude: lat, longitude: lng } : undefined
          }
        }
      },
    });

    const text = response.text || "I couldn't find any centers nearby.";
    
    // Extract grounding chunks
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const links = chunks
      .filter((c) => c.maps)
      .map((c) => ({
        title: c.maps?.title || "View on Google Maps",
        uri: c.maps?.uri || ""
      }));

    return { text, links };
  } catch (error) {
    console.error("Grounding Error:", error);
    throw new Error("Failed to search local centers.");
  }
};
