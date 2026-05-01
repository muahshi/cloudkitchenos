"use client";

import { useEffect, useState } from "react";
import { getScoreRingColor, getScoreColor } from "@/lib/utils";

interface ScoreRingProps {
  score: number;
  verdict: string;
  size?: "sm" | "md" | "lg";
  animate?: boolean;
}

const SIZE_MAP = {
  sm: { container: "w-20 h-20", text: "text-xl", sub: "text-[10px]", radius: 34, strokeWidth: 7 },
  md: { container: "w-32 h-32", text: "text-2xl", sub: "text-xs", radius: 50, strokeWidth: 9 },
  lg: { container: "w-40 h-40", text: "text-3xl", sub: "text-xs", radius: 60, strokeWidth: 11 },
};

export function ScoreRing({
  score,
  verdict,
  size = "md",
  animate = true,
}: ScoreRingProps) {
  const [displayed, setDisplayed] = useState(animate ? 0 : score);
  const dim = SIZE_MAP[size];
  const circ = 2 * Math.PI * dim.radius;
  const ringColor = getScoreRingColor(score);
  const textColor = getScoreColor(score);
  const offset = circ - (displayed / 100) * circ;

  useEffect(() => {
    if (!animate) return;
    const delay = setTimeout(() => {
      let current = 0;
      const step = setInterval(() => {
        current += 2;
        setDisplayed(Math.min(current, score));
        if (current >= score) clearInterval(step);
      }, 18);
      return () => clearInterval(step);
    }, 300);
    return () => clearTimeout(delay);
  }, [score, animate]);

  const viewBox = (dim.radius + dim.strokeWidth) * 2;
  const center = viewBox / 2;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`relative ${dim.container}`}>
        <svg
          className="w-full h-full -rotate-90"
          viewBox={`0 0 ${viewBox} ${viewBox}`}
        >
          {/* Track */}
          <circle
            cx={center}
            cy={center}
            r={dim.radius}
            fill="none"
            stroke="#1e293b"
            strokeWidth={dim.strokeWidth}
          />
          {/* Progress */}
          <circle
            cx={center}
            cy={center}
            r={dim.radius}
            fill="none"
            stroke={ringColor}
            strokeWidth={dim.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.04s linear" }}
          />
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-black text-white leading-none ${dim.text}`}>
            {displayed}
          </span>
          <span className={`text-slate-400 font-medium ${dim.sub}`}>/100</span>
        </div>
      </div>
      <span className={`text-xs font-bold uppercase tracking-wider ${textColor}`}>
        {verdict}
      </span>
    </div>
  );
}
