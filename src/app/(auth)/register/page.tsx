// (auth)/register/page.tsx
'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { User, ArrowLeft, Mail, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { createSupabaseClient } from '@lib/supabase/client';

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

    // const validatePassword = (pass: string) => {
    //     const errors: string[] = [];
    //     if (pass.length > 0 && pass.length < 8) errors.push('At least 8 characters');
    //     if (pass.length > 0 && !/[A-Z]/.test(pass)) errors.push('One uppercase letter');
    //     if (pass.length > 0 && !/[a-z]/.test(pass)) errors.push('One lowercase letter');
    //     if (pass.length > 0 && !/[0-9]/.test(pass)) errors.push('One number');
    //     setPasswordErrors(errors);
    // }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);

        if (password != confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            setLoading(false);
            return;
        }

        const supabase = createSupabaseClient();
        const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                // Email redirect URL for user confirmation after registration
                emailRedirectTo: `${window.location.origin}\login?verified=true`,
            }
        });

        if (signUpError) {
            setError(signUpError.message);
            setLoading(false);
            return;
        }

        // Show success message and stay on page
        setSuccess(true);
        setLoading(false);

        // Clear form fields
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setPasswordErrors([]);
    };


    const handleDemoLogin = async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        router.push('/dashboard?demo=true');
    };

    return (
        <div className="min-h-screen bg-primary flex items-center justify-center p-4" >
            <div className="card bg-base-100 shadow-xl w-full max-w-md">

                <button
                    onClick={() => router.push('/')}
                    className="btn btn-sm fixed top-10 left-10 mb-4 z-50"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                </button>

                <div className="card-body">
                    <div className="flex justify-center mb-4">
                        <div className="rounded-full bg-primary p-3">
                            <User className="h-8 w-8 text-primary-content" />
                        </div>
                    </div>

                    <h2 className="card-title text-3xl font-bold text-center justify-center mb-2">
                        Create Account
                    </h2>
                    <p className="text-center text-base-content opacity-70 mb-6">
                        Start your journey with HealthPulse
                    </p>

                    {success && (
                        <div className="alert alert-success mb-4">
                            <CheckCircle className="h-5 w-5" />
                            <div>
                                <h3 className="font-bold">Account created successfully!</h3>
                                <div className="text-sm">
                                    Please check your email to confirm your account before signing in.
                                </div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-error mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-4">
                        {/* Emailfield */}
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
                                    disabled={success} // Disable if already registered
                                />
                                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content opacity-40" />
                            </div>
                        </div>

                        {/* Password field */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Password</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="input input-bordered rounded-lg w-full pr-10"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        // validatePassword(e.target.value); 
                                    }}
                                    required
                                    disabled={success}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content opacity-40 hover:opacity-70"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {/* {password && passwordErrors.length > 0 && (
                                <label className="label">
                                    <span className="label-text-alt text-warning">
                                        Missing: {passwordErrors.join(', ')}
                                    </span>
                                </label>
                            )}
                            {password && passwordErrors.length === 0 && (
                                <label className="label">
                                    <span className="label-text-alt text-success flex items-center gap-1">
                                        <CheckCircle className="h-3 w-3" />
                                        Strong password
                                    </span>
                                </label>
                            )} */}
                        </div>

                        {/* Confirm Password field */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Confirm Password</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className={`input input-bordered rounded-lg w-full pr-10 ${confirmPassword && password !== confirmPassword ? 'input-error' : ''
                                        }`}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    disabled={success}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content opacity-40 hover:opacity-70"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {/* NEW: Password match indicator */}
                            {confirmPassword && password !== confirmPassword && (
                                <label className="label">
                                    <span className="label-text-alt text-error">
                                        Passwords do not match
                                    </span>
                                </label>
                            )}
                            {confirmPassword && password === confirmPassword && (
                                <label className="label">
                                    <span className="label-text-alt text-success flex items-center gap-1">
                                        <CheckCircle className="h-3 w-3" />
                                        Passwords match
                                    </span>
                                </label>
                            )}
                        </div>

                        {/* Submit button */}
                        <div className="form-control mt-6">
                            {success ? (
                                <Link href="/login" className="btn btn-primary w-full">
                                    <Mail className="h-5 w-5 mr-2" />
                                    Go to Sign In
                                </Link>
                            ) : (
                                <button
                                    type="submit"
                                    className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
                                    disabled={loading || password !== confirmPassword || passwordErrors.length > 0}
                                >
                                    {loading ? 'Creating account...' : 'Create Account'}
                                </button>
                            )}
                        </div>
                    </form>

                    {!success && (
                        <>
                            <div className="divider">OR</div>

                            <button
                                onClick={handleDemoLogin}
                                className="btn btn-outline rounded-lg hover:bg-accent"
                                disabled={loading}
                            >
                                Continue with Demo
                            </button>
                        </>
                    )}


                    {/* <div className="divider">OR</div>

                    <button
                        onClick={handleDemoLogin}
                        className="btn btn-outline rounded-lg hover:bg-accent"
                    >
                        Continue with Demo
                    </button> */}

                    <p className="text-center text-sm mt-6">
                        Already have an account?{' '}
                        <Link href="/login" className="link link-primary font-semibold">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div >
    );
}