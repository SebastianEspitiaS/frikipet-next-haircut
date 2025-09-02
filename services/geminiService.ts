import { GoogleGenAI, Modality } from "@google/genai";
import type { GeneratedOutput } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function editPetImage(
  base64ImageData: string,
  mimeType: string,
  prompt: string
): Promise<GeneratedOutput> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("No se encontraron respuestas en la API.");
    }

    const output: GeneratedOutput = { imageUrl: null, text: null };

    for (const part of response.candidates[0].content.parts) {
      if (part.text) {
        output.text = part.text;
      } else if (part.inlineData) {
        const generatedMimeType = part.inlineData.mimeType;
        const generatedData = part.inlineData.data;
        output.imageUrl = `data:${generatedMimeType};base64,${generatedData}`;
      }
    }

    return output;

  } catch (error) {
    console.error("Error llamando a la API de Gemini:", error);
    if (error instanceof Error) {
        throw new Error(`Error de la API de Gemini: ${error.message}`);
    }
    throw new Error("Ocurrió un error desconocido al contactar la API de Gemini.");
  }
}