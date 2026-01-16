import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, User, ArrowLeft, BookOpen, Sparkles, Palette } from "lucide-react";

export default function Onboarding() {
    const [name, setName] = useState("");
    const [selectedInterests, setSelectedInterests] = useState<string[]>(["Folklore"]);
    const navigate = useNavigate();

    const interests = [
        { id: "Folklore", icon: BookOpen },
        { id: "Mythology", icon: Sparkles },
        { id: "Art", icon: Palette }
    ];

    const toggleInterest = (interest: string) => {
        if (selectedInterests.includes(interest)) {
            setSelectedInterests(selectedInterests.filter(i => i !== interest));
        } else {
            setSelectedInterests([...selectedInterests, interest]);
        }
    };

    const begin = () => {
        if (!name.trim()) return alert("Please enter your name to continue");
        localStorage.setItem("katha_user", name);
        // Persist interests too if needed in future
        localStorage.setItem("katha_interests", JSON.stringify(selectedInterests));
        navigate("/home");
    };

    return (
        <div className="min-h-screen bg-earth flex items-center justify-center p-4 font-sans text-sand">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm bg-surface rounded-[40px] p-6 border border-white/5 shadow-2xl relative overflow-hidden"
            >
                {/* Top Navigation */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition"
                    >
                        <ArrowLeft size={20} className="text-white/70" />
                    </button>
                    <div className="flex gap-2">
                        <div className="w-8 h-1.5 bg-saffron rounded-full" />
                        <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
                    </div>
                    <div className="w-10" /> {/* Spacer */}
                </div>

                {/* Hero Section */}
                <div className="relative mb-8 text-center">
                    <div className="relative w-full h-40 rounded-2xl overflow-hidden mb-6 group border border-white/5">
                        <img
                            src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop"
                            alt="Golden Waves"
                            className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition duration-700"
                        />
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-earth via-transparent to-transparent opacity-80" />

                        {/* Badge */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-earth/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-2 text-xs font-semibold shadow-lg">
                            <BookOpen size={12} className="text-saffron" />
                            <span className="tracking-wide">Cultural Tales</span>
                        </div>
                    </div>

                    <h1 className="text-3xl font-serif font-bold mb-3 leading-tight tracking-wide">
                        Discover Your <br /> <span className="text-white">Roots</span>
                    </h1>
                    <p className="text-white/50 text-sm px-4 leading-relaxed font-light">
                        Stories from the past, reimagined for you. Let's begin your personalized journey.
                    </p>
                </div>

                {/* Form Section */}
                <div className="space-y-8">
                    {/* Input */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-sand/80 ml-1">What should we call you?</label>
                        <div className="relative group">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your Name"
                                className="w-full bg-earth border border-white/5 rounded-2xl px-5 py-4 pl-5 pr-12 text-white placeholder:text-white/20 focus:outline-none focus:border-saffron/50 transition-all font-medium"
                            />
                            <User className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-saffron transition-colors" size={20} />
                        </div>
                    </div>

                    {/* Interests */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-white/80 ml-1">What interests you?</label>
                        <div className="flex flex-wrap gap-3">
                            {interests.map((item) => {
                                const isSelected = selectedInterests.includes(item.id);
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => toggleInterest(item.id)}
                                        className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 border ${isSelected
                                            ? "bg-saffron text-white border-saffron shadow-[0_0_15px_rgba(236,109,19,0.4)]"
                                            : "bg-white/5 text-sand/40 border-white/5 hover:bg-white/10 hover:border-white/10 hover:text-white/60"
                                            }`}
                                    >
                                        <Icon size={14} className={isSelected ? "text-white" : "text-white/30"} />
                                        {item.id}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-10 mb-2">
                    <button
                        onClick={begin}
                        className="w-full bg-saffron hover:bg-secondary active:scale-[0.98] text-white font-bold py-4 rounded-2xl shadow-[0_0_30px_rgba(236,109,19,0.3)] hover:shadow-[0_0_40px_rgba(236,109,19,0.5)] transition-all flex items-center justify-center gap-2 group relative overflow-hidden"
                    >
                        <span className="relative z-10">सफर शुरू करें (Begin Journey)</span>
                        <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    </button>

                    {/* Social Proof */}
                    <div className="mt-8 flex items-center justify-center gap-4 opacity-60 grayscale hover:grayscale-0 transition-all duration-500 cursor-default">
                        <div className="flex -space-x-3">
                            {[10, 12, 33].map((i, idx) => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#1C1427] bg-[#2D1B4E] overflow-hidden z-0" style={{ zIndex: 3 - idx }}>
                                    <img src={`https://i.pravatar.cc/100?img=${i}`} alt="User" />
                                </div>
                            ))}
                        </div>
                        <span className="text-xs text-white/50 font-medium tracking-wide">Join 10k+ storytellers today</span>
                    </div>
                </div>

            </motion.div>
        </div>
    );
}
