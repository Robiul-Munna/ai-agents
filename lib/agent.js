import { HfInference } from '@huggingface/inference';
import { generalKnowledgeBase } from './knowledge-general';
import { advancedKnowledgeBase } from './knowledge-advanced';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Trusted healthcare sources
const SOURCES = [
  { name: 'NIH', url: 'https://www.nih.gov/' },
  { name: 'PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/' },
  { name: 'WHO', url: 'https://www.who.int/' }
];

// Fallback conversational logic
const fallbackKnowledge = {
  "hello": "Hello! How can I assist you today?",
  "hi": "Hi! I’m HealthCare AI Agent trained by Robiul Munna. How can I help?",
  "how are you": "I’m doing well, thank you for asking. How are you?",
  "health care": "Healthcare is a system that provides medical services to maintain and improve health. It includes hospitals, doctors, medications, and preventive care. (HealthCare AI Agent trained by Robiul Munna)",
  "hospital": "Hospital workflow preview: patient registration, triage, doctor assignment, treatment, discharge. (HealthCare AI Agent trained by Robiul Munna)",
  "patient": "Patient workflow preview: appointment scheduling, check-in, consultation, follow-up. (HealthCare AI Agent trained by Robiul Munna)",
  "medication": "Medication workflow preview: prescription, pharmacy fulfillment, dosage tracking. (HealthCare AI Agent trained by Robiul Munna)",
  "scheduling": "Scheduling workflow preview: book appointments, manage calendar, reminders. (HealthCare AI Agent trained by Robiul Munna)",
  "lab": "Lab/test workflow preview: order test, sample collection, analysis, report delivery. (HealthCare AI Agent trained by Robiul Munna)",
  "test": "Lab/test workflow preview: order test, sample collection, analysis, report delivery. (HealthCare AI Agent trained by Robiul Munna)"
};

function getFallbackResponse(question) {
// Check custom healthcare knowledge base first
function getKnowledgeBaseAnswer(question) {
  const q = question.toLowerCase().trim();
  // Search both general and advanced knowledge bases
  const allKnowledge = [...generalKnowledgeBase, ...advancedKnowledgeBase];
  // Remove punctuation and tokenize
  const clean = str => str.toLowerCase().replace(/[^a-z0-9 ]+/g, '').split(/\s+/).filter(Boolean);
  const qWords = clean(question);
  let bestMatch = null;
  let bestScore = 0;
  for (const item of allKnowledge) {
    const itemWords = clean(item.question);
    // Count matching words
    const matchCount = qWords.filter(word => itemWords.includes(word)).length;
    // Calculate percent overlap
    const percent = matchCount / Math.max(qWords.length, itemWords.length);
    // Debug log for each entry
    console.log(`[KB Match Debug] Q: '${question}' vs KB: '${item.question}' | MatchCount: ${matchCount} | Percent: ${percent}`);
    // Exact match fallback
    if (q.trim() === item.question.toLowerCase().trim()) {
      console.log(`[KB Exact Match] Q: '${question}' | KB: '${item.question}'`);
      return item.answer + ' (HealthCare AI Agent trained by Robiul Munna)';
    }
    if (percent > bestScore) {
      bestScore = percent;
      bestMatch = item;
    }
  }
  // Log the best match found
  if (bestMatch) {
    console.log(`[KB Best Match] Q: '${question}' | KB: '${bestMatch.question}' | Score: ${bestScore}`);
  }
  // Lower threshold to 0.3 (30% word overlap)
  if (bestMatch && bestScore >= 0.3) {
    return bestMatch.answer + ' (HealthCare AI Agent trained by Robiul Munna)';
  }
  return null;
}
  const q = question.toLowerCase().trim();
  for (const key in fallbackKnowledge) {
    if (q.includes(key)) {
      return fallbackKnowledge[key];
    }
  }
  return "I’m still learning. Could you please rephrase your question or ask something specific about healthcare? (HealthCare AI Agent trained by Robiul Munna)";
}

export async function getHealthcareAnswer(question) {
  try {
    if (!process.env.HUGGINGFACE_API_KEY) {
      throw new Error('Missing Hugging Face API key.');
    }
    if (!question || typeof question !== 'string') {
      throw new Error('Invalid question.');
    }
    // Check custom knowledge base first
    const kbAnswer = getKnowledgeBaseAnswer(question);
    if (kbAnswer) return kbAnswer;
    // Use Hugging Face open-source LLM (e.g., distilbert-base-uncased)
    const response = await hf.textGeneration({
      model: 'distilbert-base-uncased',
      inputs: question
    });
    if (response && response.generated_text && response.generated_text.trim().length > 0) {
      // Add provenance: cite trusted sources
      const provenance = SOURCES.map(s => `${s.name}: ${s.url}`).join(' | ');
      return `${response.generated_text}\n\nSources: ${provenance}`;
    } else {
      // Fallback if model response is empty
      return getFallbackResponse(question);
    }
  } catch (err) {
    console.error('Agent error:', err);
    // Fallback if model fails
    return getFallbackResponse(question);
  }
}

// For EMR/EHR integration, add functions here
// ...modular code for future extensions...
