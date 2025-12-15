// components/ChatBot.jsx
'use client';
import { useState, useEffect } from 'react';
import { useToast } from './toast';

export default function ChatBot() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!message.trim()) return;
    
    setIsLoading(true);
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast({
        title: "Authentication Error",
        description: "Please log in to use the chatbot.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:8001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, token }),
      });
      
      const data = await res.json();
      
      if (data.response.includes("Not enough tokens")) {
        toast({
          title: "Insufficient Tokens",
          description: "Please purchase more tokens to continue using the chatbot.",
          variant: "destructive"
        });
      } else if (data.response.includes("Session expired") || data.response.includes("Invalid token")) {
        toast({
          title: "Authentication Error",
          description: data.response,
          variant: "destructive"
        });
      } else {
        setChat([...chat, `You: ${message}`, `Bot: ${data.response}`]);
        if (data.newToken) {
          localStorage.setItem('token', data.newToken);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setMessage('');
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-xl bg-gray-800 text-white max-w-lg mx-auto">
      <h2 className="text-lg font-bold mb-2">Ask your Health Assistant</h2>
      <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
        {chat.map((c, i) => (
          <div key={i} className="text-sm">{c}</div>
        ))}
      </div>
      <input
        className="w-full p-2 rounded bg-gray-700 text-white mb-2"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask something..."
        disabled={isLoading}
      />
      <button
        onClick={handleSend}
        disabled={isLoading || !message.trim()}
        className={`w-full rounded p-2 ${
          isLoading || !message.trim()
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isLoading ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
}