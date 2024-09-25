import vi from '@/modules/i18n/locales/vi'

const languages = ['vi'] as const

// List of languages your application supports.
export const supportedLangs = [...languages]

// Fallback language will be used if the user language is not in the supportedLangs.
export const fallbackLang = 'vi'

// Default namespace of i18next is "translation", but you can customize it here.
export const defaultNS = 'translation'

// Translation files we created, with 'translation' as the default namespace.
// We'll use these to include the translations in the bundle, instead of loading them on-demand.
export type Languages = (typeof supportedLangs)[number]

export type Resource = {
  translation: typeof vi
}

export const resources: Record<Languages, Resource> = {
  vi: { translation: vi },
}
