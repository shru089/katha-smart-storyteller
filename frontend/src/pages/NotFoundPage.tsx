/**
 * 404 Not Found Page
 * Premium mythological themed page for unmatched routes
 */

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Home, Compass, ArrowLeft } from "lucide-react";

const floatingParticles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 4 + 3,
    delay: Math.random() * 2,
}));

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-earth relative overflow-hidden flex flex-col items-center justify-center p-6 font-sans">

            {/* Ambient glow blobs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] bg-saffron/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-amber/10 rounded-full blur-[100px]" />
            </div>

            {/* Floating particles */}
            {floatingParticles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full bg-saffron/20 pointer-events-none"
                    style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
                    animate={{ y: [-10, 10, -10], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
                />
            ))}

            {/* Main content */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 text-center max-w-sm w-full"
            >
                {/* Sanskrit mandala / decorative number */}
                <div className="relative mx-auto mb-8 w-48 h-48">
                    {/* Outer ring */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-full border border-saffron/20"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-4 rounded-full border border-saffron/10"
                    />
                    {/* Inner circle */}
                    <div className="absolute inset-8 rounded-full bg-saffron/5 border border-saffron/20 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-4xl font-bold font-serif text-saffron leading-none">४०४</div>
                            <div className="text-[8px] text-saffron/60 font-black uppercase tracking-[0.3em] mt-1">Kho Gaya</div>
                        </div>
                    </div>
                    {/* Decorative dots on ring */}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                        <div
                            key={deg}
                            className="absolute w-1.5 h-1.5 rounded-full bg-saffron/40"
                            style={{
                                top: `${50 - 46 * Math.cos((deg * Math.PI) / 180)}%`,
                                left: `${50 + 46 * Math.sin((deg * Math.PI) / 180)}%`,
                                transform: "translate(-50%, -50%)",
                            }}
                        />
                    ))}
                </div>

                {/* Text */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-saffron/70 mb-3 block">
                        Path Not Found
                    </span>
                    <h1 className="text-3xl font-bold font-serif text-white mb-3 leading-tight">
                        Lost in the<br />
                        <span className="text-saffron">Cosmic Forest</span>
                    </h1>
                    <p className="text-sand/50 text-sm leading-relaxed mb-10 px-4">
                        Even Arjuna had moments of doubt on unfamiliar paths.
                        This page has wandered beyond the known realms.
                    </p>
                </motion.div>

                {/* Action buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="flex flex-col gap-3 w-full"
                >
                    <button
                        onClick={() => navigate("/")}
                        className="w-full flex items-center justify-center gap-3 bg-saffron text-white font-bold py-4 rounded-2xl shadow-[0_0_30px_rgba(236,109,19,0.3)] hover:shadow-[0_0_40px_rgba(236,109,19,0.5)] hover:bg-saffron/90 active:scale-[0.98] transition-all group"
                    >
                        <Home size={18} />
                        Return to Katha
                        <span className="text-white/60 text-xs ml-auto group-hover:translate-x-1 transition-transform">↩</span>
                    </button>

                    <button
                        onClick={() => navigate("/explore")}
                        className="w-full flex items-center justify-center gap-3 bg-white/5 text-sand border border-white/10 font-bold py-4 rounded-2xl hover:bg-white/10 active:scale-[0.98] transition-all"
                    >
                        <Compass size={18} className="text-saffron/70" />
                        Explore Stories
                    </button>

                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-2 text-white/30 text-sm font-medium hover:text-white/50 transition-colors mt-2"
                    >
                        <ArrowLeft size={14} />
                        Go back to where you were
                    </button>
                </motion.div>

                {/* Footer verse */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="mt-12 text-[10px] text-white/20 font-serif italic leading-relaxed"
                >
                    "न जायते म्रियते वा कदाचित्" — It is never born, nor does it ever die.
                    <br />
                    <span className="not-italic font-sans text-white/15 tracking-widest uppercase">Bhagavad Gita 2.20</span>
                </motion.p>
            </motion.div>
        </div>
    );
}
