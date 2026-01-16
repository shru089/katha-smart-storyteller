import { Badge } from "../types";

export default function BadgeGrid({ badges }: { badges: Badge[] }) {
    return (
        <div className="grid grid-cols-3 gap-4">
            {badges.map(b => (
                <div key={b.code} className="bg-white rounded-lg p-3 shadow text-center">
                    <div className="text-xl">{b.icon_url ?? "🏅"}</div>
                    <div className="font-bold">{b.name}</div>
                    <div className="text-xs text-gray-500">{b.description}</div>
                </div>
            ))}
        </div>
    );
}
