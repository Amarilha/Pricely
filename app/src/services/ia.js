// Lado do navegador: guarda o histórico e chama a rota /api/ia (a chave do Gemini fica no servidor).
import { apiFetch } from './estadoAuth.js';

export async function enviarParaIA(message) {
  try {
    let chatHistory = [];
    try {
      chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    } catch {}

    const response = await apiFetch('/api/ia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history: chatHistory }),
    });
    if (!response.ok) throw new Error(`Erro na API: ${response.status}`);
    const { text } = await response.json();

    // Mantém só os últimos 10 itens no histórico
    chatHistory = [
      ...chatHistory,
      { role: "user", parts: [{ text: message }] },
      { role: "model", parts: [{ text }] },
    ].slice(-10);
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));

    return text;
  } catch (error) {
    console.error("Erro no Gemini:", error);
    return "⚠️ Erro ao consultar. Reformule sua pergunta ou tente novamente mais tarde.";
  }
}
