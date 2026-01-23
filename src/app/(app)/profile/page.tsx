// (app)/profile/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { User, Camera, Save, Lock, ArrowLeft, Calendar, Ruler, Weight, Activity } from 'lucide-react';
import { getUserProfile, updateUserProfile, uploadAvatar, updatePassword } from '@lib/data/profile';
import { AuthWrapper } from '../dashboard/AuthWrapper';
import { Sidebar } from '@components/Sidebar';
import { TopNav } from '@components/TopNav';
import { useDemoMode } from '@lib/hooks/useDemoMode';

export default function ProfilePage() {
    const router = useRouter();
    const { isDemo } = useDemoMode();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

    // Profile fields
    const [username, setUsername] = useState('');
    const [birthday, setBirthday] = useState('');
    const [heightCm, setHeightCm] = useState('');
    const [weightKg, setWeightKg] = useState('');
    const [gender, setGender] = useState('');
    const [fitnessLevel, setFitnessLevel] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');

    // Password fields
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        loadProfile();
    }, [isDemo]);

    const loadProfile = async () => {
        try {
            const profile = await getUserProfile(isDemo);
            if (profile) {
                setUsername(profile.username || '');
                setBirthday(profile.birthday || '');
                setHeightCm(profile.height_cm?.toString() || '');
                setWeightKg(profile.weight_kg?.toString() || '');
                setGender(profile.gender || '');
                setFitnessLevel(profile.fitness_level || '');
                setAvatarUrl(profile.avatar_url || '');
            }
        } catch (err) {
            console.error('Load profile error:', err);
            setError('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isDemo) {
            setError('Cannot upload avatar in demo mode');
            setTimeout(() => setError(''), 3000);
            return;
        }

        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            setError('Image must be less than 2MB');
            setTimeout(() => setError(''), 3000);
            return;
        }

        try {
            setSaving(true);
            setError('');
            const url = await uploadAvatar(file, isDemo);
            setAvatarUrl(url);
            setSuccess('Avatar updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to upload avatar');
            setTimeout(() => setError(''), 3000);
        } finally {
            setSaving(false);
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isDemo) {
            setError('Cannot update profile in demo mode');
            setTimeout(() => setError(''), 3000);
            return;
        }

        setError('');
        setSuccess('');
        setSaving(true);

        try {
            await updateUserProfile({
                username: username || null,
                birthday: birthday || null,
                height_cm: heightCm ? parseInt(heightCm) : null,
                weight_kg: weightKg ? parseFloat(weightKg) : null,
                gender: gender || null,
                fitness_level: fitnessLevel || null,
            } as any, isDemo);

            setSuccess('Profile updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to update profile');
            setTimeout(() => setError(''), 3000);
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            setTimeout(() => setError(''), 3000);
            return;
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters');
            setTimeout(() => setError(''), 3000);
            return;
        }

        setSaving(true);
        try {
            await updatePassword(newPassword, isDemo);
            setSuccess('Password updated successfully!');
            setNewPassword('');
            setConfirmPassword('');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to update password');
            setTimeout(() => setError(''), 3000);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            // <AuthWrapper>
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
            // </AuthWrapper>
        );
    }

    return (
        // <AuthWrapper>
        <div className="min-h-screen bg-base-200">
            <div className="drawer lg:drawer-open">
                <input id="sidebar-drawer" type="checkbox" className="drawer-toggle" />

                <div className="drawer-content flex flex-col">
                    <TopNav isDemo={isDemo} />

                    <div className="flex-1 p-4 lg:p-6">
                        <div className="max-w-4xl mx-auto">
                            {/* Header */}
                            <div className="mb-6">
                                <button
                                    onClick={() => router.push('/dashboard')}
                                    className="btn btn-ghost btn-sm mb-4"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Dashboard
                                </button>
                                <h1 className="text-3xl font-bold">Profile Settings</h1>
                                <p className="text-base-content opacity-70 mt-2">
                                    {isDemo ? 'Viewing demo profile (read-only)' : 'Manage your account and preferences'}
                                </p>
                            </div>

                            {/* Demo Info banner */}
                            {isDemo && (
                                <div className="alert bg-yellow-400 alert-warning mb-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <span>Demo mode — profile changes are disabled</span>
                                </div>
                            )}

                            {/* Notifications */}
                            {error && (
                                <div className="alert alert-error mb-6 shadow-lg">
                                    <span>{error}</span>
                                </div>
                            )}

                            {success && (
                                <div className="alert alert-success mb-6 shadow-lg">
                                    <span>{success}</span>
                                </div>
                            )}

                            {/* Profile Card */}
                            <div className="card bg-base-100 shadow-xl mb-6">
                                <div className="card-body">
                                    {/* Avatar Section */}
                                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 pb-6 border-b border-base-300">
                                        <div className="relative group">
                                            {avatarUrl ? (
                                                <img
                                                    src={avatarUrl}
                                                    alt="Avatar"
                                                    className="w-32 h-32 rounded-full object-cover ring-4 ring-primary ring-offset-4 ring-offset-base-100"
                                                />
                                            ) : (
                                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center ring-4 ring-primary ring-offset-4 ring-offset-base-100">
                                                    <User className="h-16 w-16 text-primary-content" />
                                                </div>
                                            )}
                                            <label className="absolute bottom-2 right-2 bg-accent rounded-full p-3 cursor-pointer hover:bg-accent-focus transition-all shadow-lg group-hover:scale-110">
                                                <Camera className="h-5 w-5 text-accent-content" />
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleAvatarUpload}
                                                    disabled={saving}
                                                />
                                            </label>
                                        </div>

                                        <div className="flex-1 text-center md:text-left">
                                            <h2 className="text-2xl font-bold mb-2">
                                                {username || 'Set your username'}
                                            </h2>
                                            <p className="text-base-content opacity-70">
                                                Upload a profile picture
                                            </p>
                                            <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                                                {fitnessLevel && (
                                                    <div className="badge badge-primary badge-lg">
                                                        <Activity className="h-3 w-3 mr-1" />
                                                        {fitnessLevel.charAt(0).toUpperCase() + fitnessLevel.slice(1)}
                                                    </div>
                                                )}
                                                {gender && gender !== 'prefer_not_to_say' && (
                                                    <div className="badge badge-secondary badge-lg">
                                                        {gender.charAt(0).toUpperCase() + gender.slice(1)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Profile Tab */}
                                    {activeTab === 'profile' && (
                                        <form onSubmit={handleProfileUpdate} className="mt-6 space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Username */}
                                                <div className="form-control">
                                                    <label className="label">
                                                        <span className="label-text font-semibold">Username</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Your username"
                                                        className="input input-bordered rounded-lg"
                                                        value={username}
                                                        onChange={(e) => setUsername(e.target.value)}
                                                    />
                                                </div>

                                                {/* Birthday */}
                                                <div className="form-control">
                                                    <label className="label">
                                                        <span className="label-text font-semibold flex items-center gap-2">
                                                            <Calendar className="h-4 w-4" />
                                                            Birthday
                                                        </span>
                                                    </label>
                                                    <input
                                                        type="date"
                                                        className="input input-bordered rounded-lg"
                                                        value={birthday}
                                                        onChange={(e) => setBirthday(e.target.value)}
                                                    />
                                                </div>

                                                {/* Height */}
                                                <div className="form-control">
                                                    <label className="label">
                                                        <span className="label-text font-semibold flex items-center gap-2">
                                                            <Ruler className="h-4 w-4" />
                                                            Height (cm)
                                                        </span>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        placeholder="175"
                                                        className="input input-bordered rounded-lg"
                                                        value={heightCm}
                                                        onChange={(e) => setHeightCm(e.target.value)}
                                                    />
                                                </div>

                                                {/* Weight */}
                                                <div className="form-control">
                                                    <label className="label">
                                                        <span className="label-text font-semibold flex items-center gap-2">
                                                            <Weight className="h-4 w-4" />
                                                            Weight (kg)
                                                        </span>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        placeholder="70.5"
                                                        className="input input-bordered rounded-lg"
                                                        value={weightKg}
                                                        onChange={(e) => setWeightKg(e.target.value)}
                                                    />
                                                </div>

                                                {/* Gender */}
                                                <div className="form-control">
                                                    <label className="label">
                                                        <span className="label-text font-semibold">Gender</span>
                                                    </label>
                                                    <select
                                                        className="select select-bordered rounded-lg"
                                                        value={gender}
                                                        onChange={(e) => setGender(e.target.value)}
                                                    >
                                                        <option value="">Select gender</option>
                                                        <option value="male">Male</option>
                                                        <option value="female">Female</option>
                                                        <option value="other">Other</option>
                                                        <option value="prefer_not_to_say">Prefer not to say</option>
                                                    </select>
                                                </div>

                                                {/* Fitness Level */}
                                                <div className="form-control">
                                                    <label className="label">
                                                        <span className="label-text font-semibold flex items-center gap-2">
                                                            <Activity className="h-4 w-4" />
                                                            Fitness Level
                                                        </span>
                                                    </label>
                                                    <select
                                                        className="select select-bordered rounded-lg"
                                                        value={fitnessLevel}
                                                        onChange={(e) => setFitnessLevel(e.target.value)}
                                                    >
                                                        <option value="">Select level</option>
                                                        <option value="beginner">Beginner</option>
                                                        <option value="intermediate">Intermediate</option>
                                                        <option value="advanced">Advanced</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="flex justify-end pt-4">
                                                <button
                                                    type="submit"
                                                    className={`btn btn-primary gap-2 ${saving ? 'loading' : ''}`}
                                                    disabled={saving}
                                                >
                                                    {!saving && <Save className="h-4 w-4" />}
                                                    {saving ? 'Saving...' : 'Save Changes'}
                                                </button>
                                            </div>
                                        </form>
                                    )}

                                    {/* Password Tab */}
                                    {activeTab === 'password' && (
                                        <form onSubmit={handlePasswordUpdate} className="mt-6">
                                            <div className="space-y-6 max-w-md">
                                                <div className="alert alert-info">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                    </svg>
                                                    <span>Password must be at least 8 characters long</span>
                                                </div>

                                                <div className="form-control">
                                                    <label className="label">
                                                        <span className="label-text font-semibold">New Password</span>
                                                    </label>
                                                    <input
                                                        type="password"
                                                        placeholder="••••••••"
                                                        className="input input-bordered rounded-lg"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                    />
                                                </div>

                                                <div className="form-control">
                                                    <label className="label">
                                                        <span className="label-text font-semibold">Confirm New Password</span>
                                                    </label>
                                                    <input
                                                        type="password"
                                                        placeholder="••••••••"
                                                        className="input input-bordered rounded-lg"
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                    />
                                                </div>

                                                <div className="flex justify-end pt-4">
                                                    <button
                                                        type="submit"
                                                        className={`btn btn-secondary gap-2 ${saving ? 'loading' : ''}`}
                                                        disabled={saving}
                                                    >
                                                        {!saving && <Lock className="h-4 w-4" />}
                                                        {saving ? 'Updating...' : 'Update Password'}
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="drawer-side">
                    <label htmlFor="sidebar-drawer" className="drawer-overlay"></label>
                    <Sidebar />
                </div>
            </div>
        </div >
        // </AuthWrapper > 
    );
}