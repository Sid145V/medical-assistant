import React, { useState, useRef, useEffect } from 'react';
import { getChatbotResponse } from '../services/geminiService';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

const Icon = ({ path, className = "h-6 w-6" }: { path: string, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

const ChatbotPage: React.FC = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
  }, [history, isLoading]);

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
  
  const quickSymptomChips = ["Headache", "Fever", "Cough", "Stomach ache"];

  const handleNewChat = () => {
    setHistory([]);
  };

  const isEmergency = (text: string) => {
      const emergencyKeywords = ["chest pain", "difficulty breathing", "severe headache", "numbness", "pregnancy pain", "emergency", "consult a doctor or visit the nearest emergency room"];
      return emergencyKeywords.some(keyword => text.toLowerCase().includes(keyword));
  };

  return (
    <div className="flex h-[calc(100vh-220px)] glass-card overflow-hidden shadow-xl">
      <div className="w-1/4 bg-white/50 dark:bg-black/20 p-4 border-r border-white/30 dark:border-white/10 flex-col hidden md:flex">
        <motion.button 
          onClick={handleNewChat} 
          className="w-full btn-secondary py-2 flex items-center justify-center space-x-2 mb-4"
          whileHover={{scale: 1.02}} whileTap={{scale: 0.98}}
        >
          <Icon path="M12 4v16m8-8H4" className="h-5 w-5" />
          <span>New Chat</span>
        </motion.button>
        <div className="flex-grow overflow-y-auto">
          <h3 className="font-bold text-text-light dark:text-text-dark mb-2">History</h3>
          {history.filter(m => m.role === 'user').slice(-5).reverse().map((msg, i) => (
              <div key={i} className="p-2 text-sm text-text-muted-light dark:text-text-muted-dark truncate hover:text-text-light dark:hover:text-text-dark cursor-pointer rounded-md hover:bg-black/5 dark:hover:bg-white/5">{msg.parts[0].text}</div>
          ))}
          <p className="text-xs text-text-muted-light/50 dark:text-text-muted-dark/50 mt-4">Chat history is temporary for this session.</p>
        </div>
      </div>
      <div className="flex-grow flex flex-col">
        <div ref={chatContainerRef} className="flex-grow p-6 space-y-6 overflow-y-auto">
          {history.length === 0 && (
            <div className="text-center text-text-muted-light/70 dark:text-text-muted-dark/70 flex flex-col items-center justify-center h-full">
                <Icon path="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" className="h-16 w-16 text-primary/20 mb-4" />
                <p className="font-semibold text-lg">Welcome, {user?.role === 'patient' && user.firstName}!</p>
                <p>Ask me about your symptoms. For example, "I have a cough and a sore throat."</p>
            </div>
          )}
          {history.map((msg, index) => {
            const isEmergencyMsg = isEmergency(msg.parts[0].text);
            return (
                <motion.div 
                    key={index} 
                    className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                  {msg.role === 'model' && <div className="w-8 h-8 bg-primary rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm shadow-md">AI</div>}
                   <div className={`relative max-w-lg p-4 rounded-2xl whitespace-pre-wrap ${msg.role === 'user' ? 'bg-gradient-to-br from-primary to-primary-dark text-white rounded-br-none shadow-lg' : 'bg-white/70 dark:bg-slate-700 text-text-light dark:text-text-dark rounded-bl-none shadow-md border border-white/50 dark:border-white/10'} ${isEmergencyMsg ? 'bg-accent/20 text-accent-dark border border-accent animate-pulse' : ''}`}>
                    {msg.parts[0].text}
                     {isEmergencyMsg && <span className="absolute -top-2 -right-2 flex h-5 w-5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span><span className="relative inline-flex rounded-full h-5 w-5 bg-accent text-white items-center justify-center text-xs">!</span></span>}
                  </div>
                </motion.div>
            )
           })}
          {isLoading && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex items-end gap-2 justify-start">
               <div className="w-8 h-8 bg-primary rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm shadow-md">AI</div>
              <div className="max-w-lg p-4 rounded-2xl bg-white/70 dark:bg-slate-700 text-text-light dark:text-text-dark rounded-bl-none shadow-md">
                <div className="flex items-center space-x-1">
                    <motion.div className="w-2 h-2 bg-primary rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }} />
                    <motion.div className="w-2 h-2 bg-primary rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}/>
                    <motion.div className="w-2 h-2 bg-primary rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}/>
                </div>
              </div>
            </motion.div>
          )}
        </div>
        <div className="p-4 border-t border-white/30 dark:border-white/10 bg-white/50 dark:bg-black/20">
          <div className="flex gap-2 mb-2">
            {quickSymptomChips.map(symptom => (
                <button key={symptom} onClick={() => setInput(symptom)} className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors">{symptom}</button>
            ))}
          </div>
          <div className="flex items-center space-x-2 bg-white/80 dark:bg-slate-800/80 border border-white/50 dark:border-white/10 rounded-full p-1 focus-within:ring-2 focus-within:ring-primary/50">
             <button className="p-2 text-text-muted-light dark:text-text-muted-dark hover:text-primary rounded-full">
                <Icon path="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your symptoms here..."
              className="flex-grow p-2 bg-transparent outline-none"
              disabled={isLoading}
            />
            <motion.button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-primary text-white p-3 rounded-full hover:bg-primary-dark disabled:bg-gray-300 dark:disabled:bg-gray-600 transition-colors flex-shrink-0"
               whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            >
              <Icon path="M5 10l7-7m0 0l7 7m-7-7v18" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;