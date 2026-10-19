"use client";
import React, { useEffect, useState } from "react";
import { TEAMS, type Team } from "@/lib/recruitment/teams";

interface TeamPickerProps {
    /** Called when the applicant presses Join on a team. */
    onJoin: (slug: string) => void;
}

/** Wait this long after the pointer arrives before the video starts, so
 *  sweeping the mouse across the cards doesn't load six videos. */
const PLAY_DELAY_MS = 250;

// Touch screens fake "hover" after a tap, which would light up the wrong card.
// Only react to hover / focus on devices that really have it.
const canHover = () =>
    typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

export default function TeamPicker({ onJoin }: TeamPickerProps) {
    const [active, setActive] = useState<string | null>(null); // card under the pointer / tapped
    const [playing, setPlaying] = useState<string | null>(null); // card whose video is running

    useEffect(() => {
        setPlaying(null); // the previous video stops immediately
        if (!active) return;
        const timer = setTimeout(() => setPlaying(active), PLAY_DELAY_MS);
        return () => clearTimeout(timer);
    }, [active]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TEAMS.map((team) => (
                <TeamCard
                    key={team.slug}
                    team={team}
                    isActive={team.slug === active}
                    isPlaying={team.slug === playing}
                    onEnter={() => canHover() && setActive(team.slug)}
                    onLeave={() => canHover() && setActive((prev) => (prev === team.slug ? null : prev))}
                    onTap={() => !canHover() && setActive(team.slug)}
                    onJoin={() => onJoin(team.slug)}
                />
            ))}
        </div>
    );
}

function TeamCard({
    team,
    isActive,
    isPlaying,
    onEnter,
    onLeave,
    onTap,
    onJoin,
}: {
    team: Team;
    isActive: boolean;
    isPlaying: boolean;
    onEnter: () => void;
    onLeave: () => void;
    onTap: () => void;
    onJoin: () => void;
}) {
    return (
        <div
            role="group"
            aria-label={`${team.name} team`}
            tabIndex={0}
            // onMouseMove (not onMouseEnter): a card only wakes up when the mouse really
            // moves over it, so a pointer left resting there after a click doesn't
            // start a video with sound by itself.
            onMouseMove={onEnter}
            onMouseLeave={onLeave}
            onFocus={onEnter}
            onBlur={(e) => {
                // Leaving the card entirely (not just moving between its own buttons)
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) onLeave();
            }}
            onClick={onTap}
            className={`rounded-xl border overflow-hidden transition-all duration-300 focus:outline-none focus-visible:border-red ${
                isActive
                    ? "border-red bg-red/10 shadow-[0_0_40px_rgba(220,38,38,0.2)]"
                    : "border-white/10 bg-white/[0.03]"
            }`}
        >
            {/* ── Video area: thumbnail, or the playing video ── */}
            <div className="relative aspect-video bg-black">
                {isPlaying ? (
                    <iframe
                        className="absolute inset-0 w-full h-full"
                        // loop=1 only works together with playlist=<same id>
                        src={`https://www.youtube-nocookie.com/embed/${team.videoId}?autoplay=1&loop=1&playlist=${team.videoId}&controls=0&rel=0&modestbranding=1&playsinline=1&fs=0`}
                        title={`${team.name} team lead video`}
                        allow="autoplay; encrypted-media; picture-in-picture"
                    />
                ) : (
                    <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={`https://i.ytimg.com/vi/${team.videoId}/hqdefault.jpg`}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover opacity-80"
                        />
                        <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="w-12 h-12 rounded-full bg-black/60 border border-white/30 flex items-center justify-center">
                                <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5 ml-0.5">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </span>
                        </span>
                    </>
                )}

                {isActive && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onJoin();
                        }}
                        className="absolute bottom-3 right-3 z-10 px-6 py-2 rounded-md bg-red text-white text-sm font-semibold tracking-wide shadow-lg hover:bg-red-700 transition-colors cursor-pointer"
                    >
                        Join
                    </button>
                )}
            </div>

            {/* ── Team name (the only text on the card) ── */}
            <div className="px-5 py-4">
                <h3 className="text-lg font-bold text-white">{team.name}</h3>
            </div>
        </div>
    );
}
