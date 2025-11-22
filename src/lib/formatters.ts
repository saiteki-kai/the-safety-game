const numberFormatter = new Intl.NumberFormat("it-IT", { minimumFractionDigits: 3 });
const dateTimeFormatter = new Intl.DateTimeFormat("it-IT", { dateStyle: "short", timeStyle: "short" });
const timeFormatter = new Intl.DateTimeFormat("it-IT", { hour: "2-digit", minute: "2-digit" });

export const formatNumber = (value: number) => numberFormatter.format(value);
export const formatDateTime = (value: string) => dateTimeFormatter.format(new Date(value));
export const formatTime = (value: string) => timeFormatter.format(new Date(value));

export function parseDateValue(value: unknown): Date | null {
  if (!value) return null;
  const parsed = typeof value === "number" ? new Date(value) : new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatDateTimeOrNull(value: unknown): string | null {
  const parsed = parseDateValue(value);
  return parsed ? dateTimeFormatter.format(parsed) : null;
}

export function toISOStringIfValid(value: unknown): string | undefined {
  const parsed = parseDateValue(value);
  return parsed ? parsed.toISOString() : undefined;
}


export function formatDecimal(value: unknown, fractionDigits = 1, fallback = "—"): string {
  const num = typeof value === "number" ? value : Number.parseFloat(String(value));
  return Number.isFinite(num) ? num.toFixed(fractionDigits) : fallback;
}
