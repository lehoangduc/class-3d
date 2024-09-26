import { useTranslation } from 'react-i18next'

export default function ProjectsEmptyPlaceholder() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-gray-200 bg-white py-12">
      <h2 className="z-10 text-lg font-semibold text-gray-700">
        {t('message.Empty projects')}
      </h2>
    </div>
  )
}
