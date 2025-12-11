// DEPRECATED: Switching to props-based locale passing — keep stub for compatibility
import type { Locale } from "@/lib/translations";
import { DEFAULT_LOCALE } from "@/lib/translations";

export const I18nContextProvider = ({ children }: { children: React.ReactNode }) => {
  // Intentionally return children unchanged — the project now uses props-based locale passing.
  return <>{children}</>;
};

export const useLocale = (): Locale => {
  // Fallback for deprecated hook; prefer passing locale props explicitly
  // eslint-disable-next-line no-console
  console.warn("useLocale() (legacy) called — prefer passing locale prop to components");
  return DEFAULT_LOCALE;
};

export const useI18n = useLocale;

