import toast from "react-hot-toast";
import { Trophy, X } from "lucide-react";

export const notifyAchievement = (title: string, subtitle: string) => {
    toast.custom((t) => (
        <div
            className={`${t.visible ? 'animate-enter' : 'animate-leave' // Basic entry animation class, though RHT handles some
                } max-w-md w-full bg-[#1C1427] shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-white/5 rounded-full pointer-events-auto flex items-center gap-4 p-2 pr-4 relative overflow-hidden`}
        >
            {/* Bottom Glow Line */}
            <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-[#d946ef] to-transparent opacity-80" />

            {/* Icon */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d946ef] to-[#f97316] flex items-center justify-center shrink-0 shadow-lg">
                <Trophy size={18} className="text-white fill-white/20" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white leading-tight">
                    {title}
                </p>
                <p className="text-xs text-white/50 truncate mt-0.5">
                    {subtitle}
                </p>
            </div>

            {/* Close */}
            <button
                onClick={() => toast.dismiss(t.id)}
                className="p-1 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
            >
                <X size={14} />
            </button>
        </div>
    ), {
        duration: 4000,
        position: 'top-right',
    });
};
