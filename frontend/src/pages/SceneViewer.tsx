import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import { toast } from "react-hot-toast"; // Added import
import { notifyAchievement } from "../utils/notifications";
import RasaPanel from "../components/reel/RasaPanel";
import AudioControl from "../components/reel/AudioControl";
import RishiChat from "../components/reel/RishiChat";
import Icon from "../components/ui/Icon";

export default function SceneViewer() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [scene, setScene] = useState<any>(null);
    const [showRasaPanel, setShowRasaPanel] = useState(false);
    const [showRishiChat, setShowRishiChat] = useState(false);
    // Removed unused generating state

    const fetchScene = async () => {
        try {
            const r = await fetch(`/api/scenes/${id}/`);
            if (r.ok) {
                const data = await r.json();
                setScene(data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const markCompleted = async () => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser || !id) return;
        const user = JSON.parse(storedUser);

        try {
            const res = await fetch(`/api/scenes/${id}/complete?user_id=${user.id}`, { method: "POST" });
            if (res.ok) {
                const data = await res.json();
                if (data.new_badges && data.new_badges.length > 0) {
                    data.new_badges.forEach((b: any) => {
                        notifyAchievement("New Badge Unlocked!", `${b.name}: ${b.description} 🏆`);
                    });
                }
            }
        } catch (e) {
            console.error("Failed to mark scene completed", e);
        }
    };

    useEffect(() => {
        fetchScene();
        const timer = setTimeout(markCompleted, 5000); // Mark as read after 5 seconds
        return () => clearTimeout(timer);
    }, [id]);

    const handlers = useSwipeable({
        onSwipedLeft: () => {
            if (scene && scene.next_scene_id) navigate(`/scene/${scene.next_scene_id}`);
        },
        onSwipedRight: () => {
            navigate(-1);
        },
        trackMouse: true
    });

    // Implement generateVoice to fix TS error
    const generateVoice = async (rasa: string) => {
        if (!scene || !scene.id) return;

        const toastId = toast.loading(`Generating voice for ${rasa}...`);

        try {
            // Note: Currently backend generates based on scene's saved emotion.
            // Future improvement: Send 'rasa' param to backend to override.
            const res = await fetch("/api/audio/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    scene_id: scene.id,
                    regenerate: true
                })
            });

            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    toast.success("Voice generated!", { id: toastId });
                    fetchScene(); // Refresh to get new audio
                } else {
                    toast.error(data.message || "Generation failed", { id: toastId });
                }
            } else {
                toast.error("Generation failed", { id: toastId });
            }
        } catch (e) {
            console.error(e);
            toast.error("Error generating voice", { id: toastId });
        }
    };

    if (!scene) return (
        <div className="min-h-screen bg-black flex items-center justify-center text-white font-serif italic text-xl">
            Unrolling the scrolls...
        </div>
    );

    return (
        <div {...handlers} className="relative min-h-screen bg-[#0F0A0A] text-white overflow-hidden font-sans">
            <AnimatePresence>
                {showRasaPanel && (
                    <div className="fixed inset-0 z-50 flex items-end">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowRasaPanel(false)} />
                        <RasaPanel
                            scene={scene}
                            onClose={() => setShowRasaPanel(false)}
                            onGenerateVoice={generateVoice}
                        />
                    </div>
                )}
                {showRishiChat && (
                    <RishiChat context={scene.raw_text} onClose={() => setShowRishiChat(false)} />
                )}
            </AnimatePresence>

            <button
                onClick={() => navigate(-1)}
                className="absolute top-6 left-6 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/10 z-20 hover:bg-black/60 transition-all"
            >
                <Icon name="arrow_back" />
            </button>

            {/* AI Rishi Chat Button */}
            <button
                onClick={() => setShowRishiChat(true)}
                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-[#EC6D13] flex items-center justify-center text-white shadow-[0_0_20px_rgba(236,109,19,0.5)] z-20 hover:scale-105 transition-all animate-bounce-slow"
            >
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rishi&clothing=graphicShirt" alt="Rishi" className="w-10 h-10 rounded-full bg-[#1A1410]" />
            </button>

            {/* Scene Content (Video or Image) */}
            <div className="absolute top-0 left-0 w-full h-[65vh] z-0 overflow-hidden">
                {scene.ai_video_url ? (
                    <video
                        key={scene.ai_video_url}
                        src={scene.ai_video_url}
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                    />
                ) : (
                    <motion.img
                        key={scene.ai_image_url || scene.id}
                        src={scene.ai_image_url || "/fallback-scene.jpg"}
                        className="w-full h-full object-cover"
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.5 }}
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0A0A] via-transparent to-black/40" />
            </div>

            {/* Bottom panel */}
            <div className="relative mt-[60vh] z-10 px-6 pt-12 pb-32 bg-gradient-to-t from-[#0F0A0A] via-[#0F0A0A] to-transparent min-h-[40vh]">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-primary/20 text-primary text-[10px] font-bold rounded-full border border-primary/20 uppercase tracking-widest">
                            {scene.emotion || "Narrative"}
                        </span>
                        {scene.music_tag && (
                            <span className="px-3 py-1 bg-white/5 text-white/40 text-[10px] font-bold rounded-full border border-white/5 uppercase tracking-widest flex items-center gap-1">
                                <Icon name="music_note" className="text-[12px]" />
                                {scene.music_tag}
                            </span>
                        )}
                    </div>

                    <h2 className="text-xl md:text-2xl font-medium leading-relaxed mb-8 text-white/90">
                        {scene.raw_text}
                    </h2>

                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={() => setShowRasaPanel(true)}
                            className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-xl transition-all"
                        >
                            <Icon name="psychology" className="text-primary" />
                            <span className="text-xs font-bold uppercase tracking-wider">Scene Mood</span>
                        </button>

                        <button
                            className="flex-1 bg-white text-black py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/90 transition-all"
                            onClick={() => scene.next_scene_id && navigate(`/scene/${scene.next_scene_id}`)}
                        >
                            Next Scene
                            <Icon name="arrow_forward" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Audio Control Floating at bottom */}
            {scene.ai_audio_url && (
                <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-black to-transparent pt-12">
                    <AudioControl audioUrl={scene.ai_audio_url} />
                </div>
            )}
        </div>
    );
}
