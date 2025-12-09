import { createContext, useContext } from "./astroContext";
import { map } from "nanostores";
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

