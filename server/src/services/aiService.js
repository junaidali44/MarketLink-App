import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env.js';

let model = null;

if (env.geminiKey) {
  const genAI = new GoogleGenerativeAI(env.geminiKey);
  model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
}

const SYSTEM_PROMPT = `You are MarketLink's assistant for a farmers-market platform.
Help users find products, markets, and answer FAQs about pickups and orders.
Keep answers under 80 words, friendly and specific.`;

export const chat = async (message, context = '') => {
  if (!model) {
    return `(Offline mode) Try searching for "${message}" on the Products page.`;
  }
  try {
    const result = await model.generateContent(
      `${SYSTEM_PROMPT}\nContext: ${context}\nUser: ${message}`
    );
    return result.response.text();
  } catch (e) {
    console.error('AI failed:', e.message);
    return `I couldn't reach the assistant right now. Please search products directly.`;
  }
};