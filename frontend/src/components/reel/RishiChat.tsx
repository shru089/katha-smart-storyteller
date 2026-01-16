import { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../ui/Icon';

interface RishiChatProps {
    context: string;
    onClose: () => void;
}

export default function RishiChat({ context, onClose }: RishiChatProps) {
    const [messages, setMessages] = useState<{ role: 'user' | 'rishi', text: string }[]>([
        { role: 'rishi', text: "Greetings, seeker. I am Rishi, keeper of the ancient lore. What wisdom do you seek from this scene?" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/ai/rishi/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: userMsg, context: context })
            });

            if (res.ok) {
                const data = await res.json();
                setMessages(prev => [...prev, { role: 'rishi', text: data.response }]);
            } else {
                setMessages(prev => [...prev, { role: 'rishi', text: "The connection to the ether is weak. Please try again." }]);
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'rishi', text: "My meditation was interrupted. Consult me again later." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="fixed inset-0 z-[60] flex flex-col justify-end pointer-events-none"
        >
            <div className="absolute inset-0 bg-black/60 pointer-events-auto" onClick={onClose} />

            <div className="relative w-full h-[80vh] bg-[#1A1410] rounded-t-[32px] overflow-hidden flex flex-col border-t border-[#EC6D13]/20 shadow-2xl pointer-events-auto">
                {/* Header */}
                <div className="p-6 bg-gradient-to-r from-[#EC6D13]/10 to-transparent flex items-center gap-4 border-b border-white/5">
                    <div className="w-12 h-12 rounded-full bg-[#EC6D13] p-0.5 shadow-[0_0_20px_rgba(236,109,19,0.4)]">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rishi&clothing=graphicShirt" alt="Rishi" className="w-full h-full rounded-full bg-[#1A1410]" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-serif font-bold text-xl text-white">Ask the Rishi</h3>
                        <p className="text-xs text-primary font-black uppercase tracking-widest">AI Cultural Companion</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60">
                        <Icon name="close" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                ? 'bg-white/10 text-white rounded-br-none'
                                : 'bg-[#EC6D13]/10 text-white/90 border border-[#EC6D13]/20 rounded-bl-none'
                                }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-[#EC6D13]/10 px-4 py-2 rounded-full flex gap-1 items-center">
                                <span className="w-1.5 h-1.5 bg-[#EC6D13] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-1.5 h-1.5 bg-[#EC6D13] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-1.5 h-1.5 bg-[#EC6D13] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-white/5 bg-[#1A1410]">
                    <div className="relative flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask about symbolism, customs, or hidden meanings..."
                            className="bg-black/40 border border-t-white/10 border-x-white/5 border-b-white/5 w-full rounded-xl py-4 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-[#EC6D13]/50"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || loading}
                            className="absolute right-2 p-2 bg-[#EC6D13] rounded-lg text-white shadow-lg disabled:opacity-50 disabled:shadow-none transition-all"
                        >
                            <Icon name="send" className="text-lg" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
