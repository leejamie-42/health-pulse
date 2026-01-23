// page.tsx (home page)
'use client';
import Link from 'next/link';
import { Target, BarChart3, TrendingUp, PartyPopper } from 'lucide-react';
import { TopNav } from '@components/TopNav';

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral">
      <TopNav />

      {/* Hero Section */}
      <div className="hero bg-primary w-full shadow-sm rounded-lg pt-10">
        <div className="hero-content text-center">
          <div className="max-w-6xl">
            <h1 className="text-5xl text-primary-content text-white md:text-6xl font-bold mb-6 py-4 mx-auto">
              HealthPulse
            </h1>
            <h2 className="text-2xl text-primary-content opacity-90 mx-auto mb-5">
              Create goals. Track calories. Take control of your life.
            </h2>
            <h2 className="text-lg  text-left text-primary-content mx-auto opacity-75 mb-10">
              HealthPulse helps you build better health habits by setting meaningful goals,
              tracking daily metrics, and visualising progress over time—all in one simple dashboard.
            </h2>
            <div className="flex flex-col items-center gap-4">
              <Link
                href="/register"
                className="btn btn-secondary hover:btn-accent btn-lg self-center"
              >
                Create Account
              </Link>
              <Link
                href="/login"
                className="btn btn-secondary hover:btn-accent btn-lg self-center"
              >
                Sign In
              </Link>

              <Link
                href="/dashboard?demo=true"
                className="btn btn-accent hover:btn-secondary btn-lg self-center mb-10"
              >
                Explore with Demo Data →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto py-16 my-12 rounded-lg">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body items-center text-center">
              <Target className="h-10 w-10 text-primary" />
              <h3 className="card-title font-bold">Set Goals</h3>
              <p className="text-base-content opacity-70">Define your fitness targets and track progress toward achieving them.</p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body items-center text-center">
              <BarChart3 className="h-10 w-10 text-primary" />
              <h3 className="card-title font-bold">Track Daily</h3>
              <p className="text-base-content opacity-70">Log workouts, calories, protein, and water intake with minimal clicks.</p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body items-center text-center">
              <PartyPopper className="h-10 w-10 text-primary" />
              <h3 className="card-title font-bold">Visualise Progress</h3>
              <p className="text-base-content opacity-70">See trends over time and celebrate your health improvements.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
