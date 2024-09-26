import type { TFunction } from 'i18next'
import { z } from 'zod'

const ProjectSchema = (t: TFunction) => {
  return z.object({
    name: z
      .string({
        message: t('error.Field is required', { field: t('field.Project Name') }),
      })
      .max(255),
  })
}

export default ProjectSchema
