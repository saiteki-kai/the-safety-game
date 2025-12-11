import { getTranslations, sectionsTranslations, type Locale, DEFAULT_LOCALE } from "@/lib/translations";

interface RenderLocaleProps {
  locale?: Locale;
}

export function RenderLocale({ locale = DEFAULT_LOCALE }: RenderLocaleProps) {
    const t = getTranslations(sectionsTranslations, locale);

    return <div>{locale} - "{t.challenge}"</div>;
}
