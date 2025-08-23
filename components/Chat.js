import { useState } from 'react';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    const res = await fetch('/api/agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input })
    });
    const data = await res.json();
    setMessages([...messages, { role: 'user', content: input }, { role: 'agent', content: data.answer }]);
    setInput('');
    setLoading(false);
  }

  return (
    <section>
      <div style={{ minHeight: 200, border: '1px solid #ccc', padding: 10 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ margin: '8px 0' }}>
            <b>{msg.role === 'user' ? 'You' : 'Agent'}:</b> {msg.content}
          </div>
        ))}
        {loading && <div>Loading...</div>}
      </div>
      <form onSubmit={sendMessage} style={{ marginTop: 10 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask a healthcare question..."
          style={{ width: '80%' }}
        />
        <button type="submit" disabled={loading}>Send</button>
      </form>
    </section>
  );
}
