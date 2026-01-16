/**
 * Login Page
 * Beautiful login UI with proper authentication flow
 */

import { useState } from 'react';
import { loginUser } from '../api/client';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface Props {
    onLogin?: (id: number) => void;
}

export default function Login({ onLogin }: Props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await loginUser(email, password);

            // Show success message
            toast.success(data.message || 'Welcome back!');

            // Call callback if provided (handles navigation)
            if (onLogin) {
                onLogin(data.user.id);
            } else {
                navigate('/');
            }

        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || 'Invalid credentials. Try again.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-earth relative overflow-hidden flex flex-col items-center justify-center p-6 pb-20">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-saffron/20 rounded-full blur-[100px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber/20 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="z-10 w-full max-w-md"
            >
                {/* Hero Section */}
                <div className="mb-10 text-center relative">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="w-24 h-24 mx-auto mb-6 rounded-full border border-saffron/30 flex items-center justify-center shadow-glow"
                    >
                        <Sparkles className="text-saffron" size={40} />
                    </motion.div>

                    <h1 className="text-4xl font-display font-bold text-sand mb-2">Discover Your Roots</h1>
                    <p className="text-sand/60 text-lg">Stories from the past, reimagined for you.</p>
                </div>

                {/* Login Form */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-[30px] p-8 shadow-2xl">
                    <h2 className="text-white text-lg font-bold mb-6">Welcome Back</h2>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-xl mb-6 text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-sand/40 mb-2 font-bold">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-saffron/50 transition-colors"
                                placeholder="sage@katha.ai"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-widest text-sand/40 mb-2 font-bold">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-saffron/50 transition-colors pr-12"
                                    placeholder="••••••••"
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button
                                fullWidth
                                size="lg"
                                className="shadow-glow group"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="animate-spin">⏳</span>
                                        Signing in...
                                    </span>
                                ) : (
                                    <>
                                        Begin Journey
                                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sand/40 text-sm">
                            New here?
                            <button
                                onClick={() => navigate('/register')}
                                className="text-saffron font-bold ml-1 hover:underline"
                                disabled={loading}
                            >
                                Create an account
                            </button>
                        </p>
                    </div>
                </div>

                {/* Interests Pills (Decoration) */}
                <div className="mt-8 flex justify-center gap-3 flex-wrap opacity-60">
                    <Chip label="Folklore" variant="default" className="bg-white/10 text-white border-0" />
                    <Chip label="Mythology" variant="default" className="bg-white/10 text-white border-0" />
                    <Chip label="Art" variant="default" className="bg-white/10 text-white border-0" />
                </div>
            </motion.div>
        </div>
    );
}
