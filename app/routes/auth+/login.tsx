import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
  json,
  redirect,
} from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { HTTPError } from 'ky'
import { useTranslation } from 'react-i18next'

import useIsPending from '@/components/hooks/use-is-pending'
import LoginSchema from '@/components/schemas/login'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthService, authSessionStore } from '@/modules/auth'
import i18next from '@/modules/i18n/i18n.server'

export const meta: MetaFunction = ({ data }: { data: any }) => {
  return [{ title: data.pageTitle }]
}

export async function loader({ request }: LoaderFunctionArgs) {
  const t = await i18next.getFixedT(request)

  return json({ pageTitle: t('common.Login') })
}

export async function action({ request }: ActionFunctionArgs) {
  const t = await i18next.getFixedT(request)
  const formData = await request.formData()

  const loginSchema = LoginSchema(t)
  const submission = parseWithZod(formData, { schema: loginSchema })

  if (submission.status !== 'success') {
    return submission.reply()
  }

  try {
    const session = await authSessionStore.getSession(request.headers.get('Cookie'))
    const data = await AuthService.auth(submission.payload)

    return redirect('/', {
      headers: {
        'Set-Cookie': await AuthService.getAuthCookie(session, data),
      },
    })
  } catch (err: unknown) {
    let message = t('error.UnexpectedError')

    if (err instanceof HTTPError) {
      const status = err.response.status
      if (status === 401) {
        message = t('error.InvalidEmailPasword')
      }
    }

    return submission.reply({
      fieldErrors: {
        password: [message],
      },
    })
  }
}

export default function Login() {
  const { t } = useTranslation()
  const isPending = useIsPending()
  const actionData = useActionData<typeof action>()

  const loginSchema = LoginSchema(t)
  const [form, { email, password }] = useForm({
    shouldValidate: 'onBlur',
    constraint: getZodConstraint(loginSchema),
    lastResult: actionData,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: loginSchema })
    },
  })

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">{t('common.Login')}</h1>
        </div>
        <div className="grid gap-6">
          <Form method="POST" autoComplete="off" {...getFormProps(form)}>
            <div className="grid gap-2">
              <div className="grid gap-1">
                <Label htmlFor={email.id}>Email</Label>
                <Input
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isPending}
                  {...getInputProps(email, { type: 'email' })}
                  error={email.errors?.join(',')}
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor={password.id}>{t('common.Password')}</Label>
                <Input
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isPending}
                  {...getInputProps(password, { type: 'password' })}
                  error={password.errors?.join(',')}
                />
              </div>
              <Button
                type="submit"
                text={t('common.Continue')}
                loading={isPending}
                disabled={isPending}
              />
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}
