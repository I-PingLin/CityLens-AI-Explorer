
import { Injectable } from '@angular/core';
import { GoogleGenAI, Type } from "@google/genai";

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai = new GoogleGenAI({ apiKey: (process as any).env.API_KEY });

  async identifyLandmark(base64Image: string) {
    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: "Identify this city landmark. Return only JSON with properties 'name', 'location' (City, Country), and 'yearBuilt' (if known). If unknown, set name to 'unknown'." },
            { inlineData: { mimeType: 'image/jpeg', data: base64Image.split(',')[1] } }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            location: { type: Type.STRING },
            yearBuilt: { type: Type.STRING }
          },
          required: ['name', 'location']
        }
      }
    });

    try {
      return JSON.parse(response.text);
    } catch (e) {
      console.error("Failed to parse identity JSON", e);
      return { name: 'unknown', location: 'unknown' };
    }
  }

  async getLandmarkDetails(landmarkName: string) {
    // Using Search Grounding for accurate, up-to-date historical information
    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Provide a detailed historical summary, architectural style, and 3 fascinating fun facts about ${landmarkName}. Also, write a short, engaging 30-second "audio tour" script that narrates the story of this landmark as if I am standing right in front of it.`,
      config: {
        tools: [{ googleSearch: {} }],
        // responseMimeType: 'application/json' is NOT allowed with googleSearch tool
      },
    });

    const text = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    // Since we can't use JSON schema with search, we ask for a standard text structure and parse it simply
    // Or just return the whole block. Let's do a second pass to structure it if needed, 
    // but for simplicity and reliability with search grounding, we'll return text and let the UI handle it.
    
    return {
      narrative: text,
      sources: sources.map((s: any) => ({
        uri: s.web?.uri,
        title: s.web?.title
      })).filter((s: any) => s.uri)
    };
  }
}
