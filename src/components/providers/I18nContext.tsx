import { createContext, useContext } from "./astroContext";
import { map } from "nanostores";
import { useTranslation as useTranslationI18n } from "react-i18next";
import i18next from "i18next";
import { useEffect } from "react";

export const I18nContextStore = map();

interface I18nContextType {
    locale: string;
}

const defaultContext: I18nContextType = {
    locale: "it",
};

export const I18nContext = createContext<I18nContextType>(
    defaultContext, I18nContextStore
);

export const I18nContextProvider = ({
    locale,
    children,
}: I18nContextType & { children: React.ReactNode }) => {
    return (
        <I18nContext.Provider value={{ locale }}>{children}</I18nContext.Provider>
    );
};

export const useI18n = () => {
    return useContext(I18nContext);
};

type Namespace = string | string[];

/**
 * Hook to get translation function using react-i18next.
 * The language is synced via I18nContextProvider.
 */
export const useTranslation = (ns?: Namespace, options?: { keyPrefix?: string }) => {
    const { locale } = useI18n();
    const { t } = useTranslationI18n(ns, { keyPrefix: options?.keyPrefix, lng: locale });
    return { t, locale };
};

