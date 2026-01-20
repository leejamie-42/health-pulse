'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Add authentication logic here
        router.push('/dashboard');
    };

    const handleDemo = () => {
        router.push('/dashboard?demo=true');
    };

    return (
        <div className="min-h-screen bg-primary flex items-center justify-center p-4" >
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
        </div >
    );
}