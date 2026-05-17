/**
 * Katha - Smart Cultural Storyteller
 * Main Application with Authentication Flow
 */

import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import MobileLayout from "./components/layout/MobileLayout";
import Onboarding from "./pages/Onboarding.tsx";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home.tsx";
import StoryDetails from "./pages/StoryDetails.tsx";
import SceneViewer from "./pages/SceneViewer.tsx";
import ChapterReader from "./pages/ChapterReader.tsx";
import Achievements from "./pages/Achievements.tsx";
import ExplorePage from "./pages/ExplorePage";
import LibraryPage from "./pages/LibraryPage";
import ProfilePage from "./pages/ProfilePage";
import MapPage from "./pages/MapPage";
import ReelsPage from "./pages/ReelsPage";
import ArchetypeQuiz from "./pages/ArchetypeQuiz";
import NotFoundPage from "./pages/NotFoundPage";
import { isAuthenticated, getStoredUser, User } from "./api/client";

// Protected Route — redirects to /onboarding if not logged in
const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/onboarding" replace />;
    }
    return children ? <>{children}</> : <Outlet />;
};

// Public Route — redirects to home if already logged in
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    if (isAuthenticated()) {
        return <Navigate to="/" replace />;
    }
    return <>{children}</>;
};

// Layout with Bottom Navigation
const MainLayout = () => (
    <MobileLayout>
        <Outlet />
    </MobileLayout>
);

// Root redirect: unauthenticated → onboarding, authenticated → home
const RootRedirect = () => {
    if (!isAuthenticated()) {
        // Check if they've been here before (skipped onboarding before)
        const hasSeenOnboarding = localStorage.getItem("katha_seen_onboarding");
        if (hasSeenOnboarding) {
            return <Navigate to="/login" replace />;
        }
        return <Navigate to="/onboarding" replace />;
    }
    return <Home />;
};

// Auth context provider
const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
    const [, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = getStoredUser();
        if (storedUser) {
            setUser(storedUser);
        }
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-earth flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    {/* Animated Katha logo / spinner */}
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 rounded-full border-2 border-saffron/20 animate-ping" />
                        <div className="absolute inset-2 rounded-full border-2 border-saffron/40 animate-pulse" />
                        <div className="absolute inset-4 rounded-full bg-saffron/20 flex items-center justify-center">
                            <span className="text-saffron text-lg">क</span>
                        </div>
                    </div>
                    <span className="text-sand/40 text-xs font-bold uppercase tracking-[0.3em]">Katha</span>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

function App() {
    // Handle auth callbacks from Login/Register pages
    const handleLogin = (_userId: number) => {
        window.location.href = "/";
    };

    const handleRegister = (_userId: number) => {
        window.location.href = "/quiz"; // Archetype quiz after registration
    };

    return (
        <BrowserRouter>
            <AuthWrapper>
                <Toaster
                    position="top-center"
                    reverseOrder={false}
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#1A1410',
                            color: '#F5E6D3',
                            border: '1px solid rgba(236, 109, 19, 0.3)',
                            borderRadius: '16px',
                            fontFamily: '"Noto Sans", sans-serif',
                        },
                        success: {
                            iconTheme: {
                                primary: '#EC6D13',
                                secondary: '#1A1410',
                            },
                        },
                    }}
                />
                <Routes>
                    {/* Root: smart redirect based on auth state */}
                    <Route path="/" element={<RootRedirect />} />

                    {/* Onboarding — first-time visitors */}
                    <Route path="/onboarding" element={
                        <PublicRoute>
                            <Onboarding />
                        </PublicRoute>
                    } />

                    {/* Auth pages */}
                    <Route path="/login" element={
                        <PublicRoute>
                            <Login onLogin={handleLogin} />
                        </PublicRoute>
                    } />
                    <Route path="/register" element={
                        <PublicRoute>
                            <Register onRegister={handleRegister} />
                        </PublicRoute>
                    } />

                    {/* Story/Scene viewing — accessible to all */}
                    <Route path="/story/:id" element={<StoryDetails />} />
                    <Route path="/chapter/:id" element={<ChapterReader />} />
                    <Route path="/scene/:id" element={<SceneViewer />} />

                    {/* Map — accessible to all */}
                    <Route path="/map" element={<MapPage />} />

                    {/* Archetype Quiz — requires login */}
                    <Route path="/quiz" element={
                        <ProtectedRoute>
                            <ArchetypeQuiz />
                        </ProtectedRoute>
                    } />

                    {/* Achievements — requires login */}
                    <Route path="/achievements" element={
                        <ProtectedRoute>
                            <Achievements />
                        </ProtectedRoute>
                    } />

                    {/* Main app with Bottom Nav — PROTECTED */}
                    <Route element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }>
                        <Route path="/home" element={<Navigate to="/" replace />} />
                        <Route path="/explore" element={<ExplorePage />} />
                        <Route path="/reels" element={<ReelsPage />} />
                        <Route path="/library" element={<LibraryPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                    </Route>

                    {/* 404 — all unmatched routes */}
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </AuthWrapper>
        </BrowserRouter>
    );
}

export default App;
