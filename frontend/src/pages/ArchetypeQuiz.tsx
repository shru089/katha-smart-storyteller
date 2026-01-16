import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { notifyAchievement } from '../utils/notifications';
import Icon from '../components/ui/Icon';

const QUESTIONS = [
    {
        question: "When faced with a difficult choice, your first instinct is to...",
        options: [
            { text: "Act decisively to resolve it", type: "warrior", icon: "swords" },
            { text: "Seek deep knowledge and wisdom", type: "sage", icon: "auto_stories" },
            { text: "Explore the unknown paths", type: "seeker", icon: "explore" },
            { text: "Protect and preserve tradition", type: "guardian", icon: "shield" }
        ]
    },
    {
        question: "Which setting calls to your soul the most?",
        options: [
            { text: "A grand battlefield of ideals", type: "warrior", icon: "military_tech" },
            { text: "A silent cave of meditation", type: "sage", icon: "self_improvement" },
            { text: "An endless winding road", type: "seeker", icon: "map" },
            { text: "A warm, enduring ancient temple", type: "guardian", icon: "fort" }
        ]
    },
    {
        question: "What is the ultimate purpose of a story?",
        options: [
            { text: "To inspire courage and duty", type: "warrior", icon: "bolt" },
            { text: "To reveal hidden cosmic truths", type: "sage", icon: "psychology" },
            { text: "To experience different lives", type: "seeker", icon: "visibility" },
            { text: "To connect us to our ancestors", type: "guardian", icon: "history" }
        ]
    }
];

const ARCHETYPES: Record<string, { title: string, desc: string, icon: string, color: string }> = {
    warrior: { title: "The Warrior", desc: "You are driven by courage, action, and unyielding duty. Your path is one of strength and righteousness.", icon: "swords", color: "#EC6D13" },
    sage: { title: "The Sage", desc: "You seek wisdom beyond the veil. Your path is one of contemplation, knowledge, and inner peace.", icon: "auto_stories", color: "#F9B233" },
    seeker: { title: "The Seeker", desc: "You are a traveler of worlds. Your path is defined by curiosity, discovery, and the joy of experience.", icon: "explore", color: "#4CAF50" },
    guardian: { title: "The Guardian", desc: "You are the shield of tradition. Your path is one of loyalty, protection, and preserving the sacred.", icon: "shield", color: "#2196F3" }
};

export default function ArchetypeQuiz() {
    const [currentStep, setCurrentStep] = useState(0);
    const [scores, setScores] = useState<Record<string, number>>({ warrior: 0, sage: 0, seeker: 0, guardian: 0 });
    const [result, setResult] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleAnswer = (type: string) => {
        const newScores = { ...scores, [type]: scores[type] + 1 };
        setScores(newScores);

        if (currentStep < QUESTIONS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            // Calculate result
            const winner = Object.entries(newScores).reduce((a, b) => b[1] > a[1] ? b : a)[0];
            setResult(winner);
            saveArchetype(winner);
        }
    };

    const saveArchetype = async (type: string) => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return;
        const user = JSON.parse(storedUser);

        try {
            await fetch(`/api/users/${user.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ archetype: type })
            });

            // Update local storage
            user.archetype = type;
            localStorage.setItem('user', JSON.stringify(user));

            notifyAchievement("Discovery!", `You have identified as ${ARCHETYPES[type].title}`);
        } catch (e) {
            console.error(e);
        }
    };

    if (result) {
        const info = ARCHETYPES[result];
        return (
            <div className="min-h-screen bg-[#0F0A0A] text-white flex flex-col items-center justify-center p-8 text-center font-sans">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10"
                    style={{ color: info.color, boxShadow: `0 0 40px ${info.color}20` }}
                >
                    <Icon name={info.icon} className="text-[48px]" />
                </motion.div>

                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-4xl font-bold font-serif mb-4"
                >
                    {info.title}
                </motion.h1>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-white/60 leading-relaxed max-w-sm mb-12"
                >
                    {info.desc}
                </motion.p>

                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/')}
                    className="bg-primary text-white px-12 py-4 rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-primary/20"
                >
                    Begin Your Journey
                </motion.button>
            </div>
        );
    }

    const q = QUESTIONS[currentStep];

    return (
        <div className="min-h-screen bg-[#0F0A0A] text-white p-8 font-sans">
            <div className="max-w-md mx-auto pt-12">
                <div className="flex justify-between items-center mb-12">
                    <span className="text-primary text-xs font-black uppercase tracking-[0.2em]">Step {currentStep + 1} of {QUESTIONS.length}</span>
                    <div className="flex gap-1">
                        {QUESTIONS.map((_, i) => (
                            <div key={i} className={`h-1 w-6 rounded-full ${i <= currentStep ? 'bg-primary' : 'bg-white/10'}`} />
                        ))}
                    </div>
                </div>

                <motion.h2
                    key={currentStep}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="text-2xl font-bold font-serif mb-12 leading-tight"
                >
                    {q.question}
                </motion.h2>

                <div className="grid gap-4">
                    <AnimatePresence mode='wait'>
                        {q.options.map((opt, idx) => (
                            <motion.button
                                key={opt.text}
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleAnswer(opt.type)}
                                className="flex items-center gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all text-left"
                            >
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
                                    <Icon name={opt.icon} />
                                </div>
                                <span className="font-medium">{opt.text}</span>
                            </motion.button>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
