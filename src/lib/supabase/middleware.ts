import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();

  // 1. Protected Routes Security
  // If no user, redirect to login
  if (
    !user &&
    (url.pathname.startsWith('/patient') ||
      url.pathname.startsWith('/psych') ||
      url.pathname.startsWith('/admin'))
  ) {
    url.pathname = '/auth';
    return NextResponse.redirect(url);
  }

  // 2. Role Based Access Control (RBAC)
  if (user) {
    const role = user.user_metadata.role;

    // Prevent Patients from accessing Psych/Admin routes
    if (
      role === 'patient' &&
      (url.pathname.startsWith('/psych') || url.pathname.startsWith('/admin'))
    ) {
      url.pathname = '/patient/dashboard';
      return NextResponse.redirect(url);
    }

    // Prevent Psychs from accessing Admin routes (modify as needed)
    if (role === 'psychologist' && url.pathname.startsWith('/admin')) {
      url.pathname = '/psych/dashboard';
      return NextResponse.redirect(url);
    }

    // Redirect connected users away from Auth pages
    if (url.pathname === '/auth') {
      if (role === 'patient') {
        url.pathname = '/patient/dashboard';
        return NextResponse.redirect(url);
      } else if (role === 'psychologist') {
        url.pathname = '/psych/dashboard';
        return NextResponse.redirect(url);
      }
    }
  }

  return response;
}
