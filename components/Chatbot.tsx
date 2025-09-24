import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { XIcon } from './icons/XIcon';
import { SendIcon } from './icons/SendIcon';
import { AyurVardanLogo } from './icons/AyurVardanLogo';

interface ChatbotProps {
    messages: ChatMessage[];
    onSendMessage: (message: string) => void;
    onClose: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ messages, onSendMessage, onClose }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            onSendMessage(input.trim());
            setInput('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 z-40 flex justify-center items-end" onClick={onClose}>
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-100 w-full max-w-lg h-[80vh] max-h-[600px] rounded-t-2xl shadow-2xl flex flex-col animate-slide-up"
            >
                <header className="bg-white rounded-t-2xl p-4 flex justify-between items-center border-b">
                    <div className="flex items-center gap-3">
                        <AyurVardanLogo className="h-8 w-8 text-[#386641]" />
                        <h2 className="text-lg font-bold">AyurBot Assistant</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100"><XIcon className="w-5 h-5"/></button>
                </header>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                             {msg.sender === 'bot' && <AyurVardanLogo className="h-8 w-8 rounded-full flex-shrink-0" />}
                             <div className={`max-w-[85%] px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-[#386641] text-white rounded-br-none' : 'bg-white text-slate-800 rounded-bl-none shadow-sm'}`}>
                                {msg.isLoading ? (
                                     <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"></div>
                                    </div>
                                ) : (
                                    <p className="whitespace-pre-wrap">{msg.text}</p>
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                 <form onSubmit={handleSend} className="bg-white p-3 border-t flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question..."
                        className="w-full bg-slate-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6A994E]"
                    />
                    <button type="submit" className="p-3 bg-[#386641] rounded-full text-white hover:bg-[#2c5134] transition-colors">
                        <SendIcon className="h-5 w-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chatbot;
