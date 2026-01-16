/**
 * Register Page
 * Beautiful signup UI with proper authentication flow
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/client';
import { Button } from '../components/Button';
import { Sparkles, ArrowRight, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface Props {
    onRegister?: (userId: number) => void;
}

export default function Register({ onRegister }: Props) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Password strength indicators
    const passwordChecks = {
        length: password.length >= 6,
        match: password === confirmPassword && confirmPassword.length > 0
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            toast.error('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const response = await registerUser(name, email, password);

            // Show success
            toast.success(response.message || 'Account created successfully!');

            // Call callback if provided
            if (onRegister) {
                onRegister(response.user.id);
            }

            // Navigate to quiz for archetype discovery
            navigate('/quiz');

        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || 'Registration failed. Try again.';
            console.error('Registration failed:', error);
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
                <div className="absolute top-[-20%] right-[-20%] w-[600px] h-[600px] bg-saffron/20 rounded-full blur-[100px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber/20 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="z-10 w-full max-w-md"
            >
                {/* Header */}
                <div className="mb-8 text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center border border-white/20 shadow-glow"
                    >
                        <Sparkles className="text-saffron" size={24} />
                    </motion.div>
                    <h1 className="text-3xl font-display font-bold text-sand">Join the Legacy</h1>
                    <p className="text-sand/60">Begin your journey into the past.</p>
                </div>

                {/* Register Form */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-[30px] p-8 shadow-2xl">
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
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-saffron/50 transition-colors"
                                placeholder="Arjuna"
                                required
                                disabled={loading}
                            />
                        </div>

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
                                    minLength={6}
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
                            {/* Password strength indicator */}
                            <div className="mt-2 flex items-center gap-2">
                                <CheckCircle
                                    size={14}
                                    className={passwordChecks.length ? "text-green-400" : "text-white/20"}
                                />
                                <span className={`text-xs ${passwordChecks.length ? "text-green-400" : "text-white/30"}`}>
                                    At least 6 characters
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-widest text-sand/40 mb-2 font-bold">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-saffron/50 transition-colors"
                                placeholder="••••••••"
                                required
                                disabled={loading}
                            />
                            {/* Match indicator */}
                            {confirmPassword && (
                                <div className="mt-2 flex items-center gap-2">
                                    <CheckCircle
                                        size={14}
                                        className={passwordChecks.match ? "text-green-400" : "text-red-400"}
                                    />
                                    <span className={`text-xs ${passwordChecks.match ? "text-green-400" : "text-red-400"}`}>
                                        {passwordChecks.match ? "Passwords match" : "Passwords don't match"}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="pt-4">
                            <Button
                                fullWidth
                                size="lg"
                                className="shadow-glow group"
                                type="submit"
                                disabled={loading || !passwordChecks.length || (confirmPassword.length > 0 && !passwordChecks.match)}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="animate-spin">⏳</span>
                                        Creating Account...
                                    </span>
                                ) : (
                                    <>
                                        Create Account
                                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sand/40 text-sm">
                            Already have an account?
                            <button
                                onClick={() => navigate('/login')}
                                className="text-saffron font-bold ml-1 hover:underline"
                                disabled={loading}
                            >
                                Login here
                            </button>
                        </p>
                    </div>
                </div>

                {/* Features preview */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 text-center text-sand/40 text-xs"
                >
                    <p>✨ Discover your archetype • 📚 Unlock stories • 🎧 Audio tales • 🎬 AI Visualization</p>
                </motion.div>
            </motion.div>
        </div>
    );
}
