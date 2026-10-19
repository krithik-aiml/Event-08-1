import { DEPARTMENTS, SEMESTERS, type Question, type Team } from './teams';

export interface GeneralDetails {
  name: string;
  collegeEmail: string;
  personalEmail: string;
  usn: string;
  phone: string;
  department: string;
  semester: string;
  otherClubs: string;
}

export const EMPTY_GENERAL: GeneralDetails = {
  name: '',
  collegeEmail: '',
  personalEmail: '',
  usn: '',
  phone: '',
  department: '',
  semester: '',
  otherClubs: '',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[6-9]\d{9}$/;
export const MAX_TEXT = 5000;

function isHttpUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

/** Returns an error message, or null when everything is fine. Runs in the
 *  browser (to guide the applicant) AND on the server (the one that counts). */
export function validateGeneral(g: Partial<GeneralDetails>): string | null {
  const v = (k: keyof GeneralDetails) => String(g[k] ?? '').trim();

  if (v('name').length < 2 || v('name').length > 100) return 'Please enter your full name.';
  if (!EMAIL_RE.test(v('personalEmail'))) return 'Please enter a valid personal email.';
  // College email may be "N/A" if the student has not received one yet.
  if (v('collegeEmail').toUpperCase() !== 'N/A' && !EMAIL_RE.test(v('collegeEmail'))) {
    return 'Please enter a valid college email, or type N/A if you have not received one.';
  }
  if (v('usn').length < 3 || v('usn').length > 100) return 'Please enter your USN / roll number.';
  if (!PHONE_RE.test(v('phone').replace(/[\s-]/g, ''))) return 'Please enter a valid 10-digit phone number.';
  if (!DEPARTMENTS.includes(v('department'))) return 'Please select your department.';
  if (!SEMESTERS.includes(v('semester'))) return 'Please select your semester.';
  if (v('otherClubs').length > MAX_TEXT) return 'Other clubs answer is too long.';
  return null;
}

export function validateAnswer(q: Question, raw: unknown): string | null {
  const value = String(raw ?? '').trim();
  if (!value) return 'Please answer this question.';
  const max = q.maxLength ?? MAX_TEXT;
  if (value.length > max) return `Please keep this under ${max} characters.`;
  if (q.type === 'url' && !isHttpUrl(value)) return 'Please paste a full link starting with https://';
  return null;
}

/** Returns the first problem found as "<question header>: <message>", or null. */
export function validateAnswers(team: Team, answers: Record<string, unknown>): string | null {
  for (const q of team.questions) {
    const err = validateAnswer(q, answers[q.header]);
    if (err) return `${q.header}: ${err}`;
  }
  return null;
}
