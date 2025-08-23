import { getHealthcareAnswer } from '../../lib/agent';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { message } = req.body;
  try {
    const answer = await getHealthcareAnswer(message);
    res.status(200).json({ answer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
