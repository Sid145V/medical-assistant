
import React, { useState, useRef, useEffect } from 'react';
import { getChatbotResponse } from '../services/geminiService';
import { useAuth } from '../context/AuthContext';

interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

const ChatbotPage: React.FC = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
  }, [history]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', parts: [{ text: input }] };
    const newHistory = [...history, userMessage];
    setHistory(newHistory);
    setInput('');
    setIsLoading(true);

    const responseText = await getChatbotResponse(input, history);
    
    const modelMessage: ChatMessage = { role: 'model', parts: [{ text: responseText }] };
    setHistory([...newHistory, modelMessage]);
    setIsLoading(false);
  };

  const handleNewChat = () => {
    setHistory([]);
  };

  return (
    <div className="flex h-[calc(100vh-150px)]">
      <div className="w-1/4 bg-gray-100 p-4 border-r flex flex-col">
        <button 
          onClick={handleNewChat} 
          className="w-full bg-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-600 transition-colors mb-4"
        >
          New Chat
        </button>
        <div className="flex-grow overflow-y-auto">
          <h3 className="font-bold text-gray-700 mb-2">History</h3>
          {/* History items could be listed here if needed */}
          <p className="text-sm text-gray-500">Chat history is temporary for this session.</p>
        </div>
      </div>
      <div className="flex-grow flex flex-col bg-white rounded-lg shadow-md">
        <div ref={chatContainerRef} className="flex-grow p-6 space-y-4 overflow-y-auto">
          {history.length === 0 && (
            <div className="text-center text-gray-500">
                <p>Welcome, {user?.role === 'patient' && user.firstName}!</p>
                <p>Ask me about your symptoms. For example, "I have a cough and a sore throat."</p>
            </div>
          )}
          {history.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-lg p-3 rounded-xl whitespace-pre-wrap ${msg.role === 'user' ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                {msg.parts[0].text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-lg p-3 rounded-xl bg-gray-200 text-gray-800">
                <span className="animate-pulse">Thinking...</span>
              </div>
            </div>
          )}
        </div>
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your symptoms here..."
              className="flex-grow p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-teal-500 text-white p-3 rounded-full hover:bg-teal-600 disabled:bg-gray-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
