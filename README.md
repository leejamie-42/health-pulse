# HealthPulse - Fitness & Nutrition SaaS Dashboard

## To run the application
```bash
```

## Summary
HealthPulse is a full-stack fitness and nutrition tracking dashboard that helps users set health goals, plan workouts, and track daily metrics over time.
The application is designed to demonstrate real-world SaaS patterns, including authentication, multi-tenant data modeling, time-series analytics, and dashboard aggregations.
By showing a dashboard and time-series view, we aim to encourage users to notice patterns in their lifestyle habits and celebrate their improvements while highlighting where they might need to work on more.

## Why HealthPulse?
This project was built to practice designing and deploying a real-world SaaS product, focusing on data modeling, user workflows, and dashboard-driven insights rather than feature quantity.


## Architecture Highlights
- Multi-tenant SaaS with user-scoped data
- Row-level security enforced at the database level
- Backend-driven analytics and aggregations
- Separation of planned vs logged activity



## Key Features

### Authentication & User Scoping
- Email & password login
- Demo account auto-login option
- Every record is scoped to a user

### Goals System:
Users can:
- Create fitness goals:
   - Goal weight
   - Weekly workouts
   - Daily calorie intake
   - Daily protein intake
- Set start & end dates for goals
- Mark goals as active/completed

### Daily Tracking
Track:
- Workout completed? (yes/no), and type of workout
- Water intake
- Calories consumed
- Protein consumed
- Optional notes (Eg mood)
UX Requirement:
- One-page daily check-in
- Minimal clicks
- Defaults to "today"

### Workout Scheduling (Shows planning  vs Logging):
- Create workout plans:
    - Name
    - Day of Week
    - Exercise list
- View weekly schedule
- Mark workouts as completed

### Dashboard with Real Aggregations:
Shows:
- Progress toward active goals
- Weekly workout completion rate
- Average daily calories (7 days)
- Water intake trend

### Demo Mode (Recruiter-Friendly)
- “Explore with Demo Data” button
- Pre-seeded realistic data
- Read-only mode


## Technology Stack
- **Frontend**: 
    - Next.js (App Router)
    - TypeScript
    - Tailwind
    - React Query
- **Backend**: 
    - Supabase
        - Postgres
        - Auth
        - Row-level security
    - Next.js API routes
- **Deployment**:
    - Vercel (frontend + serverless APIs)

## Lessons Learned

## Challenges