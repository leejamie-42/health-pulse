//(auth)/login/page.tsx
'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, ArrowLeft, Mail, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { createSupabaseClient } from '@lib/supabase/client';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const reason = searchParams.get('reason');
    const verified = searchParams.get('verified');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const supabase = createSupabaseClient();
        const { data, error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (loginError) {
            if (loginError.message.includes('Invalid login credentials')) {
                setError('Invalid email or password. Please try again.');
            } else if (loginError.message.includes('Email not confirmed')) {
                setError('Please confirm your email address before signing in. Check your inbox.');
            } else {
                setError(loginError.message);
            }
            setLoading(false);
            return;
        }

        // Clear form on success
        setEmail('');
        setPassword('');
        router.push('/dashboard');
    }

    const handleDemo = () => {
        router.push('/dashboard?demo=true');
    };

    const handleForgotPassword = async () => {
        if (!email) {
            setError('Please enter your email address first');
            return;
        }

        setLoading(true);
        const supabase = createSupabaseClient();
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
            setError(error.message);
        } else {
            alert('Password reset email sent! Check your inbox.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-primary flex items-center justify-center p-4" >
            <div className="w-full max-w-md flex flex-col items-center">
                {/* Email verification success message */}
                {verified === 'true' && (
                    <div className="alert alert-success mb-6 w-full">
                        <CheckCircle className="h-5 w-5" />
                        <span>Email verified successfully! You can now sign in.</span>
                    </div>
                )}

                {/* Auth required warning */}
                {reason == 'auth-required' && (
                    <div role="alert" className="alert alert-warning mb-6 w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>Please sign in or select demo mode to continue to dashboard</span>
                    </div>
                )}

                <button
                    onClick={() => router.push('/')}
                    className="btn btn-sm fixed top-10 left-10 mb-4 z-50"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                </button>

                <div className="card bg-base-100 shadow-xl w-full max-w-md">
                    <div className="card-body">
                        <div className="flex justify-center mb-4">
                            <div className="rounded-full bg-primary p-3">
                                <LogIn className="h-8 w-8 text-primary-content" />
                            </div>
                        </div>

                        <h2 className="card-title text-3xl font-bold text-center justify-center mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-center text-base-content opacity-70 mb-6">
                            Sign in to continue to HealthPulse
                        </p>

                        {error && (
                            <div className="alert alert-error mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-4">
                            {/* Email field */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Email</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        placeholder="you@email.com"
                                        className="input input-bordered rounded-lg w-full pr-10"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content opacity-40" />
                                </div>
                            </div>

                            {/* Password field */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Password</span>
                                    {/* Forgot password link */}
                                    <button
                                        type="button"
                                        onClick={handleForgotPassword}
                                        className="label-text-alt link link-primary text-sm"
                                    >
                                        Forgot password?
                                    </button>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="input input-bordered rounded-lg w-full pr-10"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content opacity-40 hover:opacity-70"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit button */}
                            <div className="form-control mt-6">
                                <button
                                    type="submit"
                                    className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
                                    disabled={loading}
                                >
                                    {loading ? 'Signing in...' : 'Sign In'}
                                </button>
                            </div>
                        </form>

                        <div className="divider">OR</div>

                        <button
                            onClick={handleDemo}
                            className="btn btn-outline rounded-lg hover:bg-accent"
                            disabled={loading}
                        >
                            Continue with Demo
                        </button>

                        <p className="text-center text-sm mt-6">
                            Don't have an account?{' '}
                            <Link href="/register" className="link link-primary font-semibold">
                                Create account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div >
    );
}