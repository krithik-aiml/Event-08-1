import { NextRequest, NextResponse } from 'next/server';
import { RECRUITMENT_OPEN, getTeam } from '@/lib/recruitment/teams';
import { validateAnswers, validateGeneral, type GeneralDetails } from '@/lib/recruitment/validate';

function fail(error: string, status: number) {
  return NextResponse.json({ success: false, error }, { status });
}

// Sends one JSON message to the Apps Script and returns its JSON answer.
async function callScript(url: string, payload: unknown) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    redirect: 'follow', // Apps Script answers through a redirect
    signal: AbortSignal.timeout(25000),
  });
  return res.json();
}

export async function POST(request: NextRequest) {
  if (!RECRUITMENT_OPEN) return fail('Applications are closed.', 403);

  const scriptUrl = process.env.RECRUITMENT_SCRIPT_URL;
  const secret = process.env.RECRUITMENT_SCRIPT_SECRET;
  if (!scriptUrl || !secret) {
    console.error('Recruitment env vars are missing');
    return fail('Applications are temporarily unavailable. Please try again later.', 500);
  }

  let body: {
    action?: string;
    usn?: string;
    general?: Partial<GeneralDetails>;
    teamSlug?: string;
    answers?: Record<string, unknown>;
  };
  try {
    body = await request.json();
  } catch {
    return fail('Invalid request.', 400);
  }

  // ───────────── "Has this USN already applied?" (used on the Your Details step) ─────────────
  if (body.action === 'checkUsn') {
    const usn = String(body.usn ?? '').trim();
    if (usn.length < 3 || usn.length > 100) return fail('Please enter your USN / roll number.', 400);
    try {
      const result = await callScript(scriptUrl, { secret, action: 'checkUsn', usn });
      if (result.ok) return NextResponse.json({ success: true, exists: result.exists === true });
      console.error('Apps Script rejected the USN check:', result.code, result.error);
    } catch (err) {
      console.error('Apps Script USN check failed:', err);
    }
    return fail('Could not check the USN right now.', 502);
  }

  // ───────────── Save an application ─────────────
  const general = body.general ?? {};
  const team = getTeam(body.teamSlug);
  if (!team) return fail('Please choose a valid team.', 400);

  const generalError = validateGeneral(general);
  if (generalError) return fail(generalError, 400);

  const rawAnswers = body.answers ?? {};
  const answerError = validateAnswers(team, rawAnswers);
  if (answerError) return fail(answerError, 400);

  // Only questions that exist in the config are forwarded, trimmed.
  const answers: Record<string, string> = {};
  for (const q of team.questions) answers[q.header] = String(rawAnswers[q.header]).trim();

  const payload = {
    secret,
    general: {
      name: String(general.name).trim(),
      collegeEmail: String(general.collegeEmail).trim(),
      personalEmail: String(general.personalEmail).trim(),
      usn: String(general.usn).trim(),
      phone: String(general.phone).replace(/[\s-]/g, ''),
      department: general.department,
      semester: general.semester,
      otherClubs: String(general.otherClubs ?? '').trim(),
      team: team.name,
    },
    answers,
  };

  try {
    const result = await callScript(scriptUrl, payload);

    if (result.ok) {
      return NextResponse.json({ success: true, applicationId: result.applicationId });
    }
    if (result.code === 'DUPLICATE') {
      return fail('This USN has already applied. If you think this is a mistake, contact the team.', 409);
    }
    console.error('Apps Script rejected the submission:', result.code, result.error);
    return fail('We could not save your application. Please try again in a minute.', 502);
  } catch (err) {
    console.error('Apps Script call failed:', err);
    return fail('We could not reach the server. Please try again in a minute.', 502);
  }
}
