import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface PatientPayload {
  full_name: string;
  gender: string;
  date_of_birth: string;
  medical_history: string;
  preferences_text: string;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await request.json()) as PatientPayload;

  const role =
    (userData.user.user_metadata?.role as string | undefined) || 'patient';
  if (role !== 'patient') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { error: profileError } = await supabase.from('profiles').upsert({
    id: userData.user.id,
    email: userData.user.email,
    role,
    full_name: body.full_name,
  });

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 400 });
  }

  const preferences = body.preferences_text
    ? { notes: body.preferences_text }
    : {};

  const { error } = await supabase.from('patients').upsert(
    {
      user_id: userData.user.id,
      date_of_birth: body.date_of_birth || null,
      gender: body.gender || null,
      medical_history: body.medical_history,
      preferences,
    },
    { onConflict: 'user_id' },
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
