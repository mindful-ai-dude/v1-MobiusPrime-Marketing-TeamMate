import { GoogleGenAI } from "@google/genai";
import { BusinessFormData, ModelType } from "../types";
import { FRAMEWORK_INSTRUCTIONS } from "../constants";

export const generateMarketingContent = async (
  apiKey: string,
  model: ModelType,
  data: BusinessFormData
): Promise<string> => {
  if (!apiKey) throw new Error("API Key is required");

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
  ${FRAMEWORK_INSTRUCTIONS}

  **REQUEST TYPE:** ${data.selectedOutput}

  **BUSINESS PROFILE:**
  1. **Business Name:** ${data.businessName || "AI to answer"}
  2. **Industry/Type:** ${data.industry || "AI to answer"}
  3. **Products/Services:** ${data.products || "AI to answer"}
  4. **Target Audience:** ${data.targetAudience || "AI to answer"}
  5. **Pain Points:** ${data.painPoints || "AI to answer"}
  6. **Business Goals:** ${data.goals || "AI to answer"}
  7. **Competitors:** ${data.competitors || "AI to answer"}
  8. **Unique Selling Proposition:** ${data.usp || "AI to answer"}
  9. **Marketing Details:** ${data.marketingDetails || "AI to answer"}

  Generate the ${data.selectedOutput} now.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        // Higher thinking budget for Pro models to allow complex reasoning if available/supported
        // For Flash, standard generation.
        temperature: 0.7, 
      }
    });

    return response.text || "No content generated.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to generate content");
  }
};
