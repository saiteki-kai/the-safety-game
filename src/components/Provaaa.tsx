import { useEffect, useState } from "react";
import { useTranslation } from "@providers/I18nContext";


export function RenderLocale() {
    const { t, locale } = useTranslation("challenge");
    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    if (!isMounted) {
        return <div>Loading...</div>;
    }

    return <div>{locale} - "{t("title")}"</div>;

}
