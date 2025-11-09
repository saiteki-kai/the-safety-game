const numberFormatter = new Intl.NumberFormat("it-IT", { minimumFractionDigits: 3 });
const dateTimeFormatter = new Intl.DateTimeFormat("it-IT", { dateStyle: "short", timeStyle: "short" });
const timeFormatter = new Intl.DateTimeFormat("it-IT", { hour: "2-digit", minute: "2-digit" });

export const formatNumber = (value: number) => numberFormatter.format(value);
export const formatDateTime = (value: string) => dateTimeFormatter.format(new Date(value));
export const formatTime = (value: string) => timeFormatter.format(new Date(value));
