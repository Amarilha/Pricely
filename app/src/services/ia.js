import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KE;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

let chatHistory = [];

export async function enviarParaIA(message) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
      },
    });

    chatHistory.push({
      role: "user",
      parts: [{ text: `Contexto: \n\nPergunta: ${message}` }],
    });

    const chat = model.startChat({ history: chatHistory });
    const result = await chat.sendMessage(message);
    const response = await result.response;
    let responseText = response.text() || "Desculpe, não consegui processar sua solicitação.";

    responseText = responseText.replace(/\*/g, '').replace(/```html/g, '').replace(/```/g, '').trim();

    chatHistory.push({
      role: "model",
      parts: [{ text: responseText }],
    });

    return responseText;
  } catch (error) {
    console.error("Erro ao chamar a API do Gemini:", error);
    return "Desculpe, houve um erro ao processar sua solicitação. Tente novamente mais tarde.";
  }
}