import { useEffect, useState } from "react";
import { useI18n } from "./providers/I18nContext";
import i18next from "i18next";


export function RenderLocale() {
    const { locale } = useI18n();
    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    if (!isMounted) {
        return <div>Loading...</div>;
    }

    return <div>{locale} - "{i18next.getFixedT(locale)("challenge:title")}"</div>;

}
