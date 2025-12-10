import { createContext, useContext } from "./astroContext";
import { map } from "nanostores";
import { useTranslation as useTranslationI18n } from "react-i18next";
import i18next from "i18next";
import { useEffect } from "react";

// TEMPORARY: Force Italian locale
const FORCED_LOCALE = "it";

export const I18nContextStore = map();

interface I18nContextType {
    locale: string;
}

const defaultContext: I18nContextType = {
    locale: FORCED_LOCALE,
};

export const I18nContext = createContext<I18nContextType>(
    defaultContext, I18nContextStore
);

export const I18nContextProvider = ({
    locale: _locale, // ignore passed locale
    children,
}: I18nContextType & { children: React.ReactNode }) => {
    // TEMPORARY: Force Italian on mount
    useEffect(() => {
        if (i18next.language !== FORCED_LOCALE) {
            i18next.changeLanguage(FORCED_LOCALE);
        }
    }, []);

    return (
        <I18nContext.Provider value={{ locale: FORCED_LOCALE }}>{children}</I18nContext.Provider>
    );
};

export const useI18n = () => {
    return useContext(I18nContext);
};

type Namespace = string | string[];

/**
 * Hook to get translation function using react-i18next.
 * TEMPORARY: Always uses Italian locale.
 */
export const useTranslation = (ns?: Namespace, options?: { keyPrefix?: string }) => {
    const { t } = useTranslationI18n(ns, { keyPrefix: options?.keyPrefix, lng: FORCED_LOCALE });
    return { t, locale: FORCED_LOCALE };
};

