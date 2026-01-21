// // app/dashboard/layout.tsx

// import { redirect } from 'next/navigation';
// import { createSupabaseServerClient } from '@lib/supabase/server';
// import { SearchParams } from 'next/dist/server/request/search-params';

// export default async function DashboardLayout({
//     children,
//     searchParams,
// }: {
//     children: React.ReactNode;
//     searchParams: { demo?: string };
// }) {
//     // // Demo mode
//     // const isDemo = searchParams?.demo == 'true';

//     // if (isDemo) {
//     //     return <>children</>;
//     // }

//     // Ensure user signed in. Otherwise, redirect to login page
//     const supabase = await createSupabaseServerClient();

//     const {
//         data: { user },
//     } = await supabase.auth.getUser();

//     if (!user) {
//         redirect('/login?reason=auth-required');
//     }

//     return <>{children}</>;
// }


// app/dashboard/layout.tsx
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}