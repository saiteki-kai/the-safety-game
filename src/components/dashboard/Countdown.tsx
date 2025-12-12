import { useEffect, useState, useRef } from "react";
import { DEFAULT_LOCALE, type Locale } from "@/lib/translations";

type CountdownProps = {
  startDate: Date;
  title?: string;
  description?: string;
  launchNote?: string;
  locale?: Locale;
  className?: string;
  autoReload?: boolean;
};

const UNIT_LABELS: Record<Locale, [string, string, string, string]> = {
  en: ["Days", "Hours", "Minutes", "Seconds"],
  it: ["Giorni", "Ore", "Minuti", "Secondi"],
};

const initialCountdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };

export default function Countdown({
  startDate,
  title,
  description,
  launchNote = "See you on launch",
  locale = DEFAULT_LOCALE,
  className = "",
  autoReload = true,
}: CountdownProps) {
  const [mounted, setMounted] = useState(false);
  const [countdown, setCountdown] = useState(initialCountdown);
  const finishedRef = useRef(false);

  useEffect(() => {
    setMounted(true);

    let id: number | undefined;

    const update = () => {
      const diff = Math.max(0, startDate.getTime() - Date.now());

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });

        // Prevent multiple reloads
        if (!finishedRef.current) {
          finishedRef.current = true;
          if (typeof window !== "undefined") {
            if (id) clearInterval(id);
            if (autoReload) {
              // small delay to allow UI to show zeros briefly
              setTimeout(() => window.location.reload(), 700);
            }
          }
        }

        return;
      }

      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    update();
    id = window.setInterval(update, 1000);
    return () => id && clearInterval(id);
  }, [startDate, autoReload]);

  const labels = UNIT_LABELS[locale] ?? UNIT_LABELS.en;
  const units = [
    { value: countdown.days, label: labels[0] },
    { value: countdown.hours, label: labels[1] },
    { value: countdown.minutes, label: labels[2] },
    { value: countdown.seconds, label: labels[3] },
  ];

  const baseClasses = `w-full flex-1 rounded-2xl bg-gradient-to-r from-[var(--grad-hero-start)] to-[var(--grad-hero-end)] p-6 text-white shadow-2xl ${className}`;

  if (!mounted) {
    return (
      <div className={`${baseClasses} animate-pulse flex flex-col`}>
        <div className="space-y-1">
          <p className="text-lg font-extrabold uppercase tracking-[0.1em] text-white/95">{title}</p>
          <p className="text-md font-medium text-white/90">{description}</p>
        </div>

        {/* Reserve the same vertical space as the mounted units area by rendering placeholder tiles */}
        <div className="mt-8 flex flex-1 flex-wrap gap-4 sm:gap-6 items-center content-center">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-1 min-w-[100px] flex-col items-center justify-center rounded-2xl bg-white/20 px-3 py-3 text-center sm:min-w-[120px] sm:px-5 sm:py-4 h-[160px] sm:h-[200px] md:h-[224px]"
            />
          ))}
        </div>

        <div className="mt-6 h-4 rounded bg-white/20" />
      </div>
    );
  }

  return (
    <div className={`${baseClasses} flex flex-col`}>
          <div className="space-y-1">
            <p className="text-lg font-bold uppercase tracking-[0.1em] text-white/95">{title}</p>
            <p className="text-md font-medium text-white/90">{description}</p>
          </div>

      <div className="mt-8 flex flex-1 flex-wrap gap-4 sm:gap-6 items-center content-center">
        {units.map((unit) => (
          <div
            key={unit.label}
            className="flex flex-1 min-w-[100px] flex-col items-center justify-center rounded-2xl bg-white/16 px-3 py-3 text-center sm:min-w-[120px] sm:px-5 sm:py-4 h-[160px] sm:h-[200px] md:h-[224px]"
          >
            <span className="text-5xl font-extrabold leading-none text-white sm:text-6xl md:text-7xl">{String(unit.value).padStart(2, "0")}</span>
            <span className="mt-2 text-xs font-bold uppercase tracking-[0.3em] text-white sm:text-sm">{unit.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between text-xs font-bold uppercase tracking-[0.1em] text-white sm:text-sm">
        <span className="text-white">{launchNote}</span>
        <span className="text-white/80">{new Date(startDate).toLocaleDateString(locale)}</span>
      </div>
    </div>
  );
}
