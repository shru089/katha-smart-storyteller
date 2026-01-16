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
import ReelsPage from "./pages/ReelsPage"; // New
import ArchetypeQuiz from "./pages/ArchetypeQuiz";
import { isAuthenticated, getStoredUser, User } from "./api/client";

// Protected Route component
const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }
    return children ? <>{children}</> : <Outlet />;
};

// Public Route - redirects to home if already logged in
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
                <div className="text-saffron text-xl font-serif italic animate-pulse">
                    Loading Katha...
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

function App() {
    // Handle auth callbacks from Login/Register pages
    const handleLogin = (userId: number) => {
        console.log("User logged in:", userId);
        window.location.href = "/";
    };

    const handleRegister = (userId: number) => {
        console.log("User registered:", userId);
        window.location.href = "/quiz"; // Go to archetype quiz after registration
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
                    {/* Public Routes (redirect to home if logged in) */}
                    <Route path="/onboarding" element={
                        <PublicRoute>
                            <Onboarding />
                        </PublicRoute>
                    } />
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

                    {/* Story/Scene viewing - accessible to all for now */}
                    <Route path="/story/:id" element={<StoryDetails />} />
                    <Route path="/chapter/:id" element={<ChapterReader />} />
                    <Route path="/scene/:id" element={<SceneViewer />} />

                    {/* Quiz - accessible to logged in users */}
                    <Route path="/quiz" element={
                        <ProtectedRoute>
                            <ArchetypeQuiz />
                        </ProtectedRoute>
                    } />

                    {/* Map - accessible to all */}
                    <Route path="/map" element={<MapPage />} />

                    {/* Achievements - requires login */}
                    <Route path="/achievements" element={
                        <ProtectedRoute>
                            <Achievements />
                        </ProtectedRoute>
                    } />

                    {/* Main Routes with Bottom Nav Bar - PROTECTED */}
                    <Route element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }>
                        <Route path="/" element={<Home />} />
                        <Route path="/home" element={<Navigate to="/" replace />} />
                        <Route path="/explore" element={<ExplorePage />} />
                        <Route path="/reels" element={<ReelsPage />} />
                        <Route path="/library" element={<LibraryPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                    </Route>

                    {/* Fallback - redirect to home (which will redirect to login if needed) */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthWrapper>
        </BrowserRouter>
    );
}

export default App;
