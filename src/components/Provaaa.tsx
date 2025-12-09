import { useEffect, useState } from "react";
import { useI18n } from "./providers/I18nContext";


export function RenderLocale() {
    const { locale } = useI18n();
    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    if (!isMounted) {
        return <div>Loading...</div>;
    }

    return <div>Current locale is "{locale}"</div>;

}
