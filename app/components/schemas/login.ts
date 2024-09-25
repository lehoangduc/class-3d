import type { TFunction } from 'i18next'
import { z } from 'zod'

const LoginSchema = (t: TFunction) => {
  return z.object({
    email: z
      .string({ message: t('error.FieldIsRequired', { field: 'Email' }) })
      .max(255)
      .email({ message: t('error.FieldIsInvalid', { field: 'Email' }) }),
    password: z
      .string({ message: t('error.FieldIsRequired', { field: t('common.Password') }) })
      .max(60, { message: t('error.FieldIsInvalid', { field: t('common.Password') }) }),
  })
}

export default LoginSchema
