import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Trusted healthcare sources
const SOURCES = [
  { name: 'NIH', url: 'https://www.nih.gov/' },
  { name: 'PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/' },
  { name: 'WHO', url: 'https://www.who.int/' }
];

// Fallback conversational logic
const fallbackKnowledge = {
  // General Healthcare Knowledge
  "hello": "Hello! How can I assist you today?",
  "hi": "Hi! I’m your Healthcare AI Agent. How can I help?",
  "how are you": "I’m doing well, thank you for asking. How are you?",
  "health care": "Healthcare is a system that provides medical services to maintain and improve health. It includes hospitals, doctors, medications, and preventive care.",
  "anatomy": "Human anatomy is the study of body structure, including organs, bones, muscles, and systems like cardiovascular and respiratory.",
  "physiology": "Physiology is the study of how the body and its systems function, such as breathing, circulation, and digestion.",
  "diabetes": "Diabetes is a chronic condition affecting blood sugar regulation. Management includes medication, diet, exercise, and regular monitoring.",
  "hypertension": "Hypertension (high blood pressure) increases risk for heart disease and stroke. Management includes medication, diet, and lifestyle changes.",
  "asthma": "Asthma is a condition causing airway inflammation and difficulty breathing. Treatment includes inhalers and avoiding triggers.",
  "heart disease": "Heart disease refers to conditions affecting the heart, such as coronary artery disease. Prevention includes healthy diet, exercise, and regular checkups.",
  "vaccination": "Vaccines help prevent infectious diseases. Common vaccines include flu, measles, and COVID-19.",
  "screening": "Screenings (like mammograms, colonoscopies) help detect diseases early for better outcomes.",
  "lifestyle": "Healthy lifestyle practices include balanced diet, regular exercise, enough sleep, and stress management.",
  "hospital": "Hospital workflow: patient registration, triage, doctor assignment, treatment, discharge.",
  "outpatient": "Outpatient visits involve scheduled appointments, consultation, and follow-up care without hospital admission.",
  "discharge": "Discharge is when a patient leaves the hospital with instructions for home care and follow-up.",
  "follow-up": "Follow-up visits help monitor recovery and adjust treatment as needed.",

  // Patient Care & Safety
  "medication safety": "Always follow dosage instructions, check for drug interactions, and report side effects to your provider.",
  "side effects": "Common medication side effects include nausea, headache, and dizziness. Contact your provider if severe.",
  "privacy": "Patient privacy is protected by laws like HIPAA (US) and GDPR (EU). Your health information is confidential.",
  "emergency": "Red flags for emergencies include chest pain, difficulty breathing, and stroke symptoms. Call emergency services immediately.",
  "chronic disease": "Chronic disease management includes regular monitoring, medication adherence, and lifestyle changes.",
  "post-surgery": "Post-surgery care includes wound care, pain management, and following discharge instructions.",

  // Medical Administration & Operations
  "appointment": "To schedule an appointment, contact your provider or use online booking. Set reminders for upcoming visits.",
  "insurance": "Insurance covers medical costs. Check eligibility, copays, referrals, and submit claims as needed.",
  "billing": "Medical billing uses codes like ICD-10 and CPT. Ask your provider or billing office for details.",
  "ehr": "Electronic Health Records (EHR) systems like Epic and Cerner store patient data securely for providers.",
  "triage": "Triage prioritizes patients based on urgency of their condition during intake.",

  // Clinical Support Knowledge
  "lab test": "Common lab tests include CBC, lipid panel, and HbA1c. They help diagnose and monitor health conditions.",
  "cbc": "CBC (Complete Blood Count) measures blood cells to detect infections, anemia, and other conditions.",
  "lipid panel": "A lipid panel measures cholesterol and triglycerides to assess heart disease risk.",
  "hba1c": "HbA1c measures average blood sugar over 3 months, important for diabetes management.",
  "imaging": "Imaging tests like X-ray, CT, MRI, and ultrasound help diagnose internal conditions.",
  "vital signs": "Vital signs include blood pressure, heart rate, temperature, oxygen saturation, and BMI.",
  "procedure": "Common procedures include vaccination, IV insertion, and wound care.",
  "telehealth": "Telehealth allows remote consultations via video or phone, improving access to care.",

  // Pharmacy & Medication Management
  "antibiotic": "Antibiotics treat bacterial infections. Always complete the prescribed course.",
  "painkiller": "Painkillers help manage pain. Use as directed and report any side effects.",
  "antihypertensive": "Antihypertensives lower blood pressure. Take as prescribed and monitor regularly.",
  "insulin": "Insulin helps control blood sugar in diabetes. Follow your provider’s instructions for dosing.",
  "prescription": "Prescription refills can be requested from your provider or pharmacy. Track your medication schedule.",
  "adherence": "Medication adherence means taking medicines as prescribed for best results.",
  "drug interaction": "Drug-drug interactions can cause side effects. Always inform your provider about all medications you take.",

  // Healthcare Technology & AI
  "ai": "AI in healthcare assists with decision support, symptom checking, and triage. It does not replace doctors.",
  "wearable": "Wearable devices like fitness trackers and glucometers help monitor health remotely.",
  "dashboard": "Clinical dashboards display patient data and reports for providers.",

  // Public Health & Wellness
  "nutrition": "Good nutrition includes balanced meals, fruits, vegetables, and adequate hydration.",
  "mental health": "Mental health is important. Signs of stress, depression, or anxiety should be discussed with a provider.",
  "fitness": "Regular exercise, sleep hygiene, and smoking cessation improve overall health.",
  "health literacy": "Health literacy means understanding medical terms and instructions. Ask your provider to explain anything unclear.",
  "infectious disease": "Prevent infectious diseases with hand hygiene, masks, and vaccines.",

  // Ethics & Legal
  "confidentiality": "Patient confidentiality and informed consent are essential in healthcare.",
  "equity": "Healthcare equity means fair access for all, regardless of background.",
  "bias": "AI recommendations may have bias. Always consult a healthcare professional for important decisions.",
  "limitations": "AI cannot replace doctors, only assist. For urgent or complex issues, seek professional care.",
  "referral": "If your question is beyond my scope, I recommend consulting a healthcare provider."
};

function getFallbackResponse(question) {
  const q = question.toLowerCase().trim();
  for (const key in fallbackKnowledge) {
    if (q.includes(key)) {
      return fallbackKnowledge[key];
    }
  }
  return "I’m still learning. Could you please rephrase your question or ask something specific about healthcare?";
}

export async function getHealthcareAnswer(question) {
  try {
    if (!process.env.HUGGINGFACE_API_KEY) {
      throw new Error('Missing Hugging Face API key.');
    }
    if (!question || typeof question !== 'string') {
      throw new Error('Invalid question.');
    }
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
