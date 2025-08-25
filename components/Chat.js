
import React, { useState, useRef, useEffect } from 'react';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { sender: 'user', text: input }]);
    setLoading(true);
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      // Try to extract provenance if present
      let answer = data.answer;
      let provenance = '';
      if (answer && answer.includes('Sources:')) {
        const parts = answer.split('Sources:');
        answer = parts[0].trim();
        provenance = 'Sources:' + parts[1].trim();
      }
      setMessages(msgs => [...msgs, { sender: 'agent', text: answer, provenance }]);
    } catch (err) {
      setMessages(msgs => [...msgs, { sender: 'agent', text: 'Error: Unable to get response.' }]);
    }
    setInput('');
    setLoading(false);
  };

  const handleInput = e => setInput(e.target.value);
  const handleKeyDown = e => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="healthcare-chat-ui">
      <h2 className="chat-title">Healthcare AI Agent</h2>
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={msg.sender === 'user' ? 'chat-bubble user' : 'chat-bubble agent'}>
            <div className="bubble-text">{msg.text}</div>
            {msg.provenance && <div className="provenance">{msg.provenance}</div>}
          </div>
        ))}
        {loading && <div className="loading">Thinking...</div>}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-row">
        <input
          type="text"
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Ask a healthcare question..."
          className="chat-input"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="send-btn"
        >Send</button>
      </div>
      <div className="chat-footer">
        Powered by open-source LLMs | Answers cite trusted sources when possible
      </div>
      <style jsx>{`
        .healthcare-chat-ui {
          max-width: 500px;
          margin: 40px auto;
          background: #f8fafc;
          border-radius: 16px;
          box-shadow: 0 2px 16px #e0e7ef;
          padding: 24px;
          display: flex;
          flex-direction: column;
        }
        .chat-title {
          text-align: center;
          color: #2563eb;
          margin-bottom: 24px;
        }
        .chat-messages {
          min-height: 300px;
          margin-bottom: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          overflow-y: auto;
        }
        .chat-bubble {
          max-width: 80%;
          border-radius: 12px;
          padding: 10px 16px;
          font-size: 16px;
          box-shadow: 0 1px 4px #e0e7ef;
          position: relative;
        }
        .chat-bubble.user {
          align-self: flex-end;
          background: #2563eb;
          color: #fff;
        }
        .chat-bubble.agent {
          align-self: flex-start;
          background: #e0f7fa;
          color: #2563eb;
        }
        .bubble-text {
          margin-bottom: 4px;
        }
        .provenance {
          font-size: 12px;
          color: #64748b;
          margin-top: 2px;
        }
        .loading {
          color: #2563eb;
          text-align: center;
        }
        .chat-input-row {
          display: flex;
          gap: 8px;
        }
        .chat-input {
          flex: 1;
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          font-size: 16px;
        }
        .send-btn {
          background: #2563eb;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 0 20px;
          font-size: 16px;
          cursor: pointer;
        }
        .send-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .chat-footer {
          margin-top: 16px;
          font-size: 13px;
          color: #64748b;
          text-align: center;
        }
        @media (max-width: 600px) {
          .healthcare-chat-ui {
            max-width: 100%;
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
}
