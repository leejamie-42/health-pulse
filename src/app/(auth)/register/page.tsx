'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LogIn } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError('Passwords do not match');
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        try {
            // TODO: Implement Supabase authentication
            // const { data, error } = await supabase.auth.signUp({
            //   email,
            //   password,
            // });

            // Placeholder: redirect to dashboard
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            router.push('/dashboard');
        } catch (err) {
            setError('Failed to create account. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDemoLogin = async () => {
        setLoading(true);
        // Simulate demo login
        await new Promise(resolve => setTimeout(resolve, 500));
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
                        Create Account
                    </h2>
                    <p className="text-center text-base-content opacity-70 mb-6">
                        Start your journey with HealthPulse
                    </p>

                    <form onSubmit={handleRegister} className="space-y-4">
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

                        <div className="form-control">
                            <label className="label block mb-2">
                                <span className="label-text">Confirm Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="input input-bordered rounded-lg w-full"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-control mt-6 flex justify-center">
                            <button
                                type="submit"
                                className={`btn btn-primary w-full mb-3 ${loading ? 'loading' : ''}`}
                                disabled={loading}
                            >
                                {loading ? 'Creating account...' : 'Create Account'}
                            </button>
                        </div>
                    </form>

                    <div className="divider">OR</div>

                    <button
                        onClick={handleDemoLogin}
                        className="btn btn-outline rounded-lg hover:bg-accent"
                    >
                        Continue with Demo
                    </button>

                    <p className="text-center text-sm mt-6">
                        Already have an account?{' '}
                        <Link href="/login" className="link link-primary">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div >
    );
}