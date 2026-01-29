# HealthPulse - Fitness & Nutrition SaaS Dashboard

## To run the application
```bash
# 1. Create a supabase project at https://supabase.com

# 2. Set up environment variables:
# create a .env.local file and populate it with:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 3. Run the SQL migrations in your Supabase SQL Editor - Create base tables and populate with seed data (you will need tables profiles, goals, and daily_logs)

# 4. Install dependencies
npm install

# 5. Run application
npm run dev
```

## Summary
HealthPulse is a full-stack fitness and nutrition tracking dashboard that helps users set health goals, plan workouts, and track daily metrics over time.
This project demonstrates real-world SaaS development patterns including:
- Multi-tenant architecture with user-scoped data
- Row-level security (RLS) enforced at the database level
- Time-series data visualisation and analytics
- Email-based authentication with verification
- Demo mode for portfolio showcase


## Why This Project Matters
This project showcases:
- Full-stack development (frontend + backend + database)
- Modern tech stack (Next.js 14, TypeScript, Supabase)
- Production-ready patterns (auth, RLS, multi-tenant)
- Clean code architecture (separation of concerns, reusable components)
- User-centered design (demo mode, real-time validation, helpful errors)
- Data visualization (dashboard analytics, progress tracking)



## Key Features

### Authentication
- User registration (email & password) with email authentication
- Secure login with "forgot password" functionality
- **Demo mode**: Explore the app with pre-populated realistic data (no signup required)
- Row-level security ensures users only see and update their own data

### Dashboard
Real-time overview of your health metrics:
- Active goals summary with progress bars
- This week's workout count (e.g., "3/5 workouts completed")
- Average calories consumed (current week)
- Water intake trend (this week vs. last week)
- Quick actions to log today's metrics or create new goals

### Goals Management
Create and track fitness goals with full CRUD operations:
- Set custom goals (weight loss, daily steps, protein intake, etc.)
- Track progress with visual progress bars
- Start dates and deadline tracking
- Five status types: Not Started, Active, Paused, Completed, Failed
- Smart status indicators (near completion, when achieved, overdue)

### Daily Logging
Comprehensive daily health tracking:
- **Activity**: Workout completion, duration, steps
- **Nutrition**: Calories, protein, water intake
- **Body Metrics**: Weight tracking
- **Wellness**: Sleep hours, mood (1-5), energy level (1-5)
- **Notes**: Journal-style daily reflections

UX Highlights:
- "Log Today" quick action button
- One log per day (prevents duplicates)
- Edit or delete past entries
- Visual icon feedback for mood and energy levels
- Only shows metrics you've filled in (clean interface)

### Profile Management
Customise your profile:
- Avatar upload
- Personal info (username, birthday, height, weight)
- Fitness level tracking
- Password updates



## Architecture

### Technology Stack
- **Frontend**: 
    - **Next.js 14** (App Router) - React framework with server components
    - **TypeScript**
    - **Tailwind CSS**
    - **DaisyUI** - Pre-built component library
    - **Lucide Icons** - Modern icon library
- **Backend & Database:**
    - **Supabase**
        - PostgreSQL database
        - Authentication (email/password)
        - Row-Level Security (RLS)
        - Real-time subscriptions
        - Storage (avatar uploads)
- **Deployment:**
    - **Vercel** - Serverless deployment with edge functions



### **Data Architecture**
**Multi-tenant SaaS design:**
- All data scoped by `user_id`
- RLS policies prevent unauthorized access
- Separate tables for:
  - `profiles` - User information
  - `goals` - User-created fitness goals
  - `daily_logs` - Time-series health metrics






## Project Structure
```
healthpulse/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx          # Login page
│   │   └── register/page.tsx       # Registration page
│   ├── dashboard/
│   │   ├── page.tsx                # Main dashboard
│   │   └── AuthWrapper.tsx         # Authentication wrapper
│   ├── goals/page.tsx              # Goals management
│   ├── daily-log/page.tsx          # Daily logging interface
│   └── profile/page.tsx            # User profile
├── components/
│   ├── GoalCard.tsx                # Goal display card
│   ├── CreateGoalModal.tsx         # Goal creation form
│   ├── DailyLogForm.tsx            # Daily log form
│   ├── DailyLogCard.tsx            # Daily log display
│   └── ...
├── lib/
│   ├── data/
│   │   ├── goals.ts                # Goals CRUD operations
│   │   ├── dailyLogs.ts            # Daily logs CRUD
│   │   ├── dashboard.ts            # Dashboard analytics
│   │   └── profile.ts              # Profile management
│   ├── hooks/
│   │   ├── useDemoMode.ts          # Demo mode state
│   │   └── useUserProfile.ts       # User profile data
│   └── supabase/
│       ├── client.ts               # Supabase client
│       └── server.ts               # Server-side client
└── public/
```

---

## 🗄️ Database Setup

### **Tables Structure**

**1. profiles**
```sql
- id (UUID, primary key)
- email (text)
- username (text)
- avatar_url (text)
- birthday (date)
- height_cm (integer)
- weight_kg (numeric)
- gender (text)
- fitness_level (text)
- created_at (timestamp)
- updated_at (timestamp)
```

**2. goals**
```sql
- id (bigserial, primary key)
- user_id (UUID, foreign key → profiles)
- name (text)
- target_value (numeric)
- current_value (numeric)
- unit (text)
- status (enum: not_started, active, paused, completed, failed)
- start_date (date)
- deadline_date (date)
- created_at (timestamp)
- updated_at (timestamp)
```

**3. daily_logs**
```sql
- id (bigserial, primary key)
- user_id (UUID, foreign key → profiles)
- log_date (date, unique per user)
- workout_completed (boolean)
- workout_time_minutes (integer)
- steps (integer)
- calories_consumed (integer)
- protein_intake_g (numeric)
- water_ml (integer)
- weight_kg (numeric)
- sleep_hours (numeric)
- mood_rating (integer 1-5)
- energy_level (integer 1-5)
- notes (text)
- created_at (timestamp)
- updated_at (timestamp)
```

**Row-Level Security:**
All tables have RLS policies that ensure:
```sql
-- Users can only SELECT/INSERT/UPDATE/DELETE their own data
WHERE auth.uid() = user_id
```

---

## Design Decisions

### **Week-Based Analytics**
- All dashboard metrics use Monday-Sunday boundaries
- "This week" = current week from Monday to today
- "Last week" = previous Monday-Sunday
- Consistent across all metrics (workouts, calories, water)

### **One Log Per Day**
- Enforced by database unique constraint (`user_id`, `log_date`)
- Prevents duplicate entries
- Users edit existing log instead of creating new ones

### **Goal Status Lifecycle**
- **Not Started** → **Active** → **Completed** ✓
- **Not Started** → **Active** → **Paused** → **Active**
- **Active** → **Failed** ✗
- Terminal statuses are **Completed** or **Failed**
- Clear status transitions with visual indicators

### **Demo Mode**
- Uses a dedicated demo user account
- localStorage-based persistence across sessions
- Read-only (write operations blocked)
- Profile & Goals Data: Pre-populated with demo data
- Faily logs: Automatic daily data generation

---

## Security Features

- **Authentication**: Email verification required for new accounts
- **Row-Level Security**: Database-level access control
- **Password Requirements**: 
  - Minimum 8 characters
- **Protected Routes**: AuthWrapper component guards dashboard pages
- **CSRF Protection**: Built-in Next.js security
- **Environment Variables**: Sensitive keys never exposed client-side

---

## Challenges & Solutions

### **Challenge 1: Next.js Pre-rendering Issues**
**Problem:** Pages using `useSearchParams()` caused hydration errors in production.

**Solution:** 
- Wrapped `useSearchParams()` in Suspense boundaries
- Created wrapper components for client-side only features
- Used dynamic imports where needed

### **Challenge 2: Demo Mode Persistence**
**Problem:** Demo mode wouldn't persist across page navigation.

**Solution:**
- Combined URL parameters with localStorage
- Created `useDemoMode` hook to centralise logic
- Check localStorage first, then URL params
- Clear demo mode when real user logs in

### **Challenge 3: Real-time Form Validation**
**Problem:** Users could submit invalid forms before seeing errors.

**Solution:**
- Real-time password strength indicator
- Live password match validation
- Disabled submit button until valid
- Visual feedback with colors and icons

---

## Future Enhancements

- **Progress/Charts Page**: Line charts for weight, calories, water over time
- **AI Chatbot**: Users can ask AI agent questions like "Create a personalised workout/nutrition plan based on my historical records" or "Recommend me some fun sports to try"
- **Workout Plans**: Schedule workouts for specific days
- **Export Data**: Download your data as CSV/JSON
- **Social Features**: Share achievements, compare with friends
- **Reminders**: Email/push notifications for daily logging

---

## Lessons Learned

1. **Supabase is powerful but requires learning**: RLS policies, realtime subscriptions, and storage all have nuances
2. **TypeScript catches bugs early**: Type safety in database queries prevented many runtime errors
3. **Component separation matters**: Reusable components (GoalCard, DailyLogForm) made development much faster
4. **Demo mode is essential for portfolios**: Lets recruiters explore without signup friction
5. **Real-time validation improves UX**: Users appreciate immediate feedback on forms
6. **Week-based metrics are intuitive**: Users understand "this week" better than arbitrary date ranges


## License

This project is open source and available under the MIT License.

---

## Author

Built by Jamie Lee as a portfolio project to demonstrate full-stack development skills.
