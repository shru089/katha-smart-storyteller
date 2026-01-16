import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="bg-earth text-white px-4 py-3 flex justify-between items-center">
            <Link to="/home" className="font-bold text-lg">🕉️ Katha</Link>
            <div className="flex gap-3">
                <Link to="/achievements" className="bg-saffron px-3 py-1 rounded text-earth font-semibold">Achievements</Link>
            </div>
        </nav>
    );
}
