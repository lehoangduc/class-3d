import type { TFunction } from 'i18next'
import { z } from 'zod'

const LoginSchema = (t: TFunction) => {
  return z.object({
    email: z
      .string({ message: t('error.Field is required', { field: 'Email' }) })
      .max(255)
      .email({ message: t('error.Field is invalid', { field: 'Email' }) }),
    password: z
      .string({ message: t('error.Field is required', { field: t('common.Password') }) })
      .max(60, { message: t('error.Field is invalid', { field: t('common.Password') }) }),
  })
}

export default LoginSchema
