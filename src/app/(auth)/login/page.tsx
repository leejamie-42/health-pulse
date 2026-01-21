//(auth)/login/page.tsx
'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';
import { supabase } from '@lib/supabase/client';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const searchParams = useSearchParams();
    const reason = searchParams.get('reason');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        if (error) {
            alert(error.message);
            return;
        }
        router.push('/dashboard');
    };


    const handleDemo = () => {
        router.push('/dashboard?demo=true');
    };

    return (
        <div className="min-h-screen bg-primary flex items-center justify-center p-4" >
            <div className="w-full max-w-md flex flex-col items-center">
                {reason == 'auth-required' && (
                    <div role="alert" className="alert alert-warning mb-10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>Please sign in or select demo mode to continue to dashboard</span>
                    </div>
                )}
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

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="form-control">
                                <label className="label block mb-2">
                                    <span className="label-text">Email</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="you@email.com"
                                    className="input input-bordered rounded-lg w-full"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label block mb-2">
                                    <span className="label-text">Password</span>
                                </label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="input input-bordered rounded-lg w-full"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-control mt-6 flex justify-center">
                                <button type="submit" className="btn btn-primary rounded-lg">
                                    Sign In
                                </button>
                            </div>
                        </form>

                        <div className="divider">OR</div>

                        <button
                            onClick={handleDemo}
                            className="btn btn-outline rounded-lg hover:bg-accent"
                        >
                            Continue with Demo
                        </button>

                        <p className="text-center text-sm mt-6">
                            Don't have an account?{' '}
                            <Link href="/register" className="link link-primary">
                                Create account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div >
    );
}