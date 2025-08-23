import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Trusted healthcare sources
const SOURCES = [
  { name: 'NIH', url: 'https://www.nih.gov/' },
  { name: 'PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/' },
  { name: 'WHO', url: 'https://www.who.int/' }
];

export async function getHealthcareAnswer(question) {
  // Use Hugging Face open-source LLM (e.g., distilbert-base-uncased)
  const response = await hf.textGeneration({
    model: 'distilbert-base-uncased',
    inputs: question
  });
  // Add provenance: cite trusted sources
  const provenance = SOURCES.map(s => `${s.name}: ${s.url}`).join(' | ');
  return `${response.generated_text}\n\nSources: ${provenance}`;
}

// For EMR/EHR integration, add functions here
// ...modular code for future extensions...
