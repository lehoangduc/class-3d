import type { TFunction } from 'i18next'
import { z } from 'zod'

const ProjectSchema = (t: TFunction) => {
  return z.object({
    name: z
      .string({ message: t('error.FieldIsRequired', { field: t('field.ProjectName') }) })
      .max(255),
  })
}

export default ProjectSchema
