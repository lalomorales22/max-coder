import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to convert file to base64
export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64String,
          mimeType: file.type
        }
      });
    };
    reader.readAsDataURL(file);
  });
};

export const generateGameCode = async (
  promptText: string,
  imageFile?: File | null
): Promise<{ explanation: string; code: string }> => {
  try {
    const parts: any[] = [];
    
    if (imageFile) {
      const imagePart = await fileToGenerativePart(imageFile);
      parts.push(imagePart);
    }
    
    parts.push({
      text: `You are an expert game developer for kids.
      User request: "${promptText}".
      
      If an image is provided, analyze it as a game level sketch.
      
      Your goal is to generate a SINGLE HTML file containing CSS and JS that implements this simple game.
      The game should be playable in a web browser.
      
      ALSO, provide a simple, encouraging explanation for a child about how the code works.
      
      Ensure the code uses canvas or DOM elements to be interactive.
      Make the game colors neon and dark mode to match a "Space" theme.
      Keep the game code concise and functional.`
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            explanation: {
              type: Type.STRING,
              description: "A friendly explanation for a child about the code logic."
            },
            code: {
              type: Type.STRING,
              description: "The full executable HTML code for the game."
            }
          },
          required: ["explanation", "code"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    // With responseSchema, the text is guaranteed to be valid JSON structure
    return JSON.parse(text);

  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};