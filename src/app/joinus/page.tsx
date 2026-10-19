"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
    DEPARTMENTS,
    RECRUITMENT_OPEN,
    SEMESTERS,
    getTeam,
    type Question,
} from "@/lib/recruitment/teams";
import {
    EMPTY_GENERAL,
    validateAnswers,
    validateGeneral,
    type GeneralDetails,
} from "@/lib/recruitment/validate";
import TeamPicker from "./TeamPicker";


type Step = "intro" | "general" | "team" | "questions" | "done";

const DRAFT_KEY = "tedx-recruitment-draft";
const STEP_TITLES: Partial<Record<Step, string>> = {
    general: "Your details",
    team: "Choose your team",
    questions: "Team questions",
};
const PROGRESS_STEPS: Step[] = ["general", "team", "questions"];

export default function JoinUsPage() {
    const [step, setStep] = useState<Step>("intro");
    const [general, setGeneral] = useState<GeneralDetails>(EMPTY_GENERAL);
    const [teamSlug, setTeamSlug] = useState("");
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [applicationId, setApplicationId] = useState("");
    const [hydrated, setHydrated] = useState(false);
    const [isChecking, setIsChecking] = useState(false); // checking the USN on step 1
    const [usnError, setUsnError] = useState("");

    const team = getTeam(teamSlug);

    // Restore an unfinished application (survives a refresh, not a closed tab).
    useEffect(() => {
        try {
            const raw = sessionStorage.getItem(DRAFT_KEY);
            if (raw) {
                const d = JSON.parse(raw);
                if (d.general) setGeneral({ ...EMPTY_GENERAL, ...d.general });
                if (getTeam(d.teamSlug)) setTeamSlug(d.teamSlug);
                if (d.answers && typeof d.answers === "object") setAnswers(d.answers);
                if (d.step === "general" || d.step === "team") setStep(d.step);
                if (d.step === "questions") setStep(getTeam(d.teamSlug) ? "questions" : "team");
            }
        } catch {
            /* storage unavailable: start fresh */
        }
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (!hydrated || step === "done") return;
        try {
            sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ step, general, teamSlug, answers }));
        } catch {
            /* ignore */
        }
    }, [hydrated, step, general, teamSlug, answers]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [step]);

    function go(next: Step) {
        setError("");
        setStep(next);
    }

    function handleGeneralChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) {
        const { name, value } = e.target;
        setGeneral((prev) => ({ ...prev, [name]: value }));
        setError("");
        if (name === "usn") setUsnError("");
    }

    async function handleGeneralSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (isChecking) return;
        const problem = validateGeneral(general);
        if (problem) return setError(problem);

        // Ask the server whether this USN has already applied. If it has, stay on this step.
        setIsChecking(true);
        setError("");
        setUsnError("");
        try {
            const res = await fetch("/api/recruitment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "checkUsn", usn: general.usn }),
            });
            const result = await res.json().catch(() => ({}));
            if (result.exists === true) {
                setUsnError("This USN has already applied. If you think this is a mistake, please contact the team.");
                document.querySelector<HTMLInputElement>("input[name=usn]")?.focus();
                return;
            }
        } catch {
            // The check itself could not run (network problem). Let them carry on:
            // the final Submit checks the USN again before saving anything.
        } finally {
            setIsChecking(false);
        }
        go("team");
    }

    // After a successful submit: back to the first page, with a clean form.
    function startOver() {
        setGeneral(EMPTY_GENERAL);
        setTeamSlug("");
        setAnswers({});
        setApplicationId("");
        setUsnError("");
        go("intro");
    }

    // "Join" on a team card: remember the team and open its questions.
    function handleJoin(slug: string) {
        if (!getTeam(slug)) return;
        if (slug !== teamSlug) setAnswers({}); // answers belong to one team only
        setTeamSlug(slug);
        go("questions");
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (isSubmitting || !team) return;

        const problem = validateAnswers(team, answers);
        if (problem) return setError(problem);

        setIsSubmitting(true);
        setError("");
        try {
            const res = await fetch("/api/recruitment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ general, teamSlug: team.slug, answers }),
            });
            const result = await res.json().catch(() => ({}));
            if (!res.ok || !result.success) {
                throw new Error(result.error || "Something went wrong. Please try again.");
            }
            try {
                sessionStorage.removeItem(DRAFT_KEY);
            } catch {
                /* ignore */
            }
            setApplicationId(result.applicationId || "");
            go("done");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    // ───────────── closed ─────────────
    if (!RECRUITMENT_OPEN) {
        return (
            <Shell>
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Recruitment <span className="text-red">Closed</span>
                    </h1>
                    <p className="text-gray-400 mb-8">
                        Thank you for your interest in TEDxCITBengaluru. Follow us on Instagram for updates.
                    </p>
                    <Link href="/" className="btn btn-secondary">Back to home</Link>
                </div>
            </Shell>
        );
    }

    // ───────────── intro (the apply landing page) ─────────────
    if (step === "intro") {
        return (
            <Shell>
                <div className="text-center">
                    <p className="text-xs font-semibold tracking-[0.3em] uppercase text-red mb-4">Recruitment</p>
                    <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                        Join <span className="text-red">TEDxCITBengaluru</span>
                    </h1>
                    <p className="text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed">
                        Tell us about yourself, meet the team leads, pick where you want to contribute and answer a few
                        questions. It takes about 10 minutes.
                    </p>

                    <ol className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left mb-10">
                        {[
                            ["01", "Your details", "Name, contact and college info."],
                            ["02", "Pick a team", "Meet each lead and choose your fit."],
                            ["03", "Team questions", "A few questions for that team."],
                        ].map(([n, title, text]) => (
                            <li key={n} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                                <span className="text-xs font-semibold tracking-[0.25em] text-red">{n}</span>
                                <p className="font-semibold mt-2">{title}</p>
                                <p className="text-sm text-gray-400 mt-1">{text}</p>
                            </li>
                        ))}
                    </ol>

                    <button type="button" onClick={() => go("general")} className="btn btn-primary">
                        Start application
                    </button>
                    <p className="text-xs text-gray-500 mt-4">Your progress is kept if you refresh this page.</p>
                </div>
            </Shell>
        );
    }

    // ───────────── done ─────────────
    if (step === "done") {
        return (
            <Shell>
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-2 border-red bg-red/10 mb-8">
                        <svg className="w-10 h-10 text-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold mb-6">
                        Application submitted <span className="text-red">successfully!</span>
                    </h1>
                    <p className="text-gray-400 mb-3">
                        Thank you for applying to <span className="text-red font-semibold">TEDxCITBengaluru</span>. Our
                        team will review your application and get back to you.
                    </p>
                    {applicationId && (
                        <p className="text-sm text-gray-400 mb-3">
                            Your application ID: <span className="font-mono text-white">{applicationId}</span>
                        </p>
                    )}
                    <p className="text-sm text-gray-500 mb-10">Please keep an eye on your email, including spam.</p>
                    <button type="button" onClick={startOver} className="btn btn-primary">Return home</button>
                </div>
            </Shell>
        );
    }

    // ───────────── the three form steps ─────────────
    return (
        <Shell wide={step === "team"}>
            <Progress current={step} />

            <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
                {step === "questions" && team ? (
                    <>
                        Questions for <span className="text-red">{team.name}</span>
                    </>
                ) : (
                    STEP_TITLES[step]
                )}
            </h1>

            {error && (
                <div role="alert" className="mb-8 rounded-lg border border-red/40 bg-red/10 text-red-200 px-4 py-3 text-sm">
                    {error}
                </div>
            )}

            {step === "general" && (
                <form onSubmit={handleGeneralSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Field label="Full name">
                            <input name="name" value={general.name} onChange={handleGeneralChange} required className="form-input" placeholder="e.g. Veronica Smith" autoComplete="name" />
                        </Field>
                        <Field label="College email (type N/A if not received)">
                            <input name="collegeEmail" type="text" inputMode="email" value={general.collegeEmail} onChange={handleGeneralChange} required className="form-input" placeholder="you@cambridge.edu.in" />
                        </Field>
                        <Field label="Personal email">
                            <input name="personalEmail" type="email" value={general.personalEmail} onChange={handleGeneralChange} required className="form-input" placeholder="yourname@gmail.com" autoComplete="email" />
                        </Field>
                        <Field label="USN / Roll number" error={usnError}>
                            <input name="usn" value={general.usn} onChange={handleGeneralChange} required className={`form-input ${usnError ? "!border-red" : ""}`} placeholder="Not received? Drop your name & section." />
                        </Field>
                        <Field label="Phone number">
                            <input name="phone" type="tel" value={general.phone} onChange={handleGeneralChange} required className="form-input" placeholder="9XXXXXXXXX" autoComplete="tel" />
                        </Field>
                        <Field label="Department">
                            <select name="department" value={general.department} onChange={handleGeneralChange} required className="form-select [&>option]:bg-black">
                                <option value="">Select department</option>
                                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </Field>
                        <Field label="Semester">
                            <select name="semester" value={general.semester} onChange={handleGeneralChange} required className="form-select [&>option]:bg-black">
                                <option value="">Select semester</option>
                                {SEMESTERS.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </Field>
                    </div>
                    <Field label="Other clubs / communities (optional)">
                        <textarea name="otherClubs" value={general.otherClubs} onChange={handleGeneralChange} rows={3} className="form-textarea" placeholder="Are you part of any clubs? Mention your role and the name of the community." />
                    </Field>

                    <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4">
                        <button type="button" onClick={() => go("intro")} className="btn btn-secondary sm:min-w-40">← Back</button>
                        <button type="submit" disabled={isChecking} className="btn btn-primary sm:flex-1 disabled:opacity-60">{isChecking ? "Checking…" : "Continue"}</button>
                    </div>
                </form>
            )}

            {step === "team" && (
                <div>
                    <p className="text-center text-gray-400 mb-8">
                        Hover over a team (or tap it on a phone) to watch its lead&apos;s video. Press Join when you
                        have found your fit.
                    </p>
                    <TeamPicker onJoin={handleJoin} />
                    <div className="pt-10">
                        <button type="button" onClick={() => go("general")} className="btn btn-secondary sm:min-w-40">← Back</button>
                    </div>
                </div>
            )}

            {step === "questions" && team && (
                <form onSubmit={handleSubmit} className="space-y-12">
                    {team.questions.map((q, i) => (
                        <QuestionField
                            key={`${team.slug}-${q.header}`}
                            q={q}
                            number={i + 1}
                            value={answers[q.header] ?? ""}
                            disabled={isSubmitting}
                            onChange={(v) => {
                                setAnswers((prev) => ({ ...prev, [q.header]: v }));
                                setError("");
                            }}
                        />
                    ))}

                    <div className="flex flex-col-reverse sm:flex-row gap-4 pt-8 border-t border-white/10">
                        <button type="button" onClick={() => go("team")} disabled={isSubmitting} className="btn btn-secondary sm:min-w-48">← Change team</button>
                        <button type="submit" disabled={isSubmitting} className="btn btn-primary sm:flex-1 disabled:opacity-60">
                            {isSubmitting ? "Submitting…" : "Submit application"}
                        </button>
                    </div>
                </form>
            )}
        </Shell>
    );
}

/* ───────────── small pieces ───────────── */

function Shell({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
    return (
        <main className="bg-black text-white min-h-screen flex flex-col">
            <div className="w-full h-[2px] bg-red" />
            <section className="flex-1 flex items-center justify-center px-5 py-16 md:py-24">
                <div className={`w-full ${wide ? "max-w-5xl" : "max-w-3xl"}`}>{children}</div>
            </section>
            <div className="w-full h-[2px] bg-red" />
        </main>
    );
}

function Progress({ current }: { current: Step }) {
    const index = PROGRESS_STEPS.indexOf(current);
    return (
        <div className="mb-10" aria-label={`Step ${index + 1} of ${PROGRESS_STEPS.length}`}>
            <p className="text-center text-xs tracking-[0.25em] uppercase text-gray-500 mb-3">
                Step {index + 1} of {PROGRESS_STEPS.length}
            </p>
            <div className="flex gap-2">
                {PROGRESS_STEPS.map((s, i) => (
                    <div key={s} className={`h-1 flex-1 rounded-full ${i <= index ? "bg-red" : "bg-white/10"}`} />
                ))}
            </div>
        </div>
    );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-300">{label}</span>
            {children}
            {error && <span role="alert" className="text-sm text-red-300">{error}</span>}
        </label>
    );
}

function QuestionField({
    q,
    number,
    value,
    disabled,
    onChange,
}: {
    q: Question;
    number: number;
    value: string;
    disabled: boolean;
    onChange: (v: string) => void;
}) {
    const id = `q-${number}`;
    const common = {
        id,
        required: true,
        disabled,
        value,
        placeholder: q.placeholder,
    };

    return (
        <div className="flex flex-col gap-4">
            <label htmlFor={id} className="text-lg md:text-xl font-semibold leading-relaxed">
                {number}. {q.label}
            </label>

            {q.media?.images && (
                <div className={`grid gap-4 ${q.media.images.length > 1 ? "sm:grid-cols-2" : ""}`}>
                    {q.media.images.map((src, i) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            key={src}
                            src={src}
                            alt={`Reference image ${i + 1} for question ${number}`}
                            loading="lazy"
                            className="w-full h-auto max-h-[480px] object-contain rounded-lg border border-white/10 bg-white/[0.03]"
                        />
                    ))}
                </div>
            )}

            {q.media?.videoId && (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-white/10">
                    <iframe
                        className="absolute inset-0 w-full h-full"
                        src={`https://www.youtube-nocookie.com/embed/${q.media.videoId}?rel=0`}
                        title={`Video for question ${number}`}
                        loading="lazy"
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            )}

            {q.type === "url" ? (
                <input {...common} type="url" onChange={(e) => onChange(e.target.value)} className="form-input" />
            ) : q.type === "short" ? (
                <input {...common} type="text" maxLength={q.maxLength} onChange={(e) => onChange(e.target.value)} className="form-input" />
            ) : (
                <textarea {...common} rows={q.rows ?? 3} onChange={(e) => onChange(e.target.value)} className="form-textarea min-h-[110px]" />
            )}
        </div>
    );
}
