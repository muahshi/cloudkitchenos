"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TypewriterTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  onComplete?: () => void;
  showCursor?: boolean;
}

export function TypewriterText({
  text,
  speed = 18,
  delay = 0,
  className,
  onComplete,
  showCursor = true,
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(delay === 0);

  // Start delay
  useEffect(() => {
    if (delay === 0) return;
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  // Typewriter effect
  useEffect(() => {
    if (!started || !text) return;
    setDisplayed("");
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
        onComplete?.();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, started, onComplete]);

  return (
    <span className={cn("inline", className)}>
      {displayed}
      {showCursor && !done && (
        <span className="inline-block w-0.5 h-[1em] bg-indigo-400 ml-0.5 align-middle animate-pulse" />
      )}
    </span>
  );
}

// ── Multi-line typewriter for longer content ───────────────────────────────────
interface TypewriterBlockProps {
  lines: string[];
  speed?: number;
  lineDelay?: number;
  className?: string;
  lineClassName?: string;
}

export function TypewriterBlock({
  lines,
  speed = 14,
  lineDelay = 400,
  className,
  lineClassName,
}: TypewriterBlockProps) {
  const [currentLine, setCurrentLine] = useState(0);
  const [completedLines, setCompletedLines] = useState<string[]>([]);

  const handleLineComplete = () => {
    const nextLine = currentLine + 1;
    setCompletedLines((prev) => [...prev, lines[currentLine]]);
    if (nextLine < lines.length) {
      setTimeout(() => setCurrentLine(nextLine), lineDelay);
    }
  };

  return (
    <div className={cn("space-y-1", className)}>
      {completedLines.map((line, i) => (
        <p key={i} className={lineClassName}>
          {line}
        </p>
      ))}
      {currentLine < lines.length && (
        <p className={lineClassName}>
          <TypewriterText
            text={lines[currentLine]}
            speed={speed}
            onComplete={handleLineComplete}
          />
        </p>
      )}
    </div>
  );
}
