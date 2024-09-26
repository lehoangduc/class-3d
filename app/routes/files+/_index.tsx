import { unlink } from 'node:fs/promises'
import { resolve as resolvePath } from 'node:path'
import {
  type ActionFunctionArgs,
  json,
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from '@remix-run/node'

import { getSharedEnv } from '@/configs/utils'
import { AuthService } from '@/modules/auth'
import { DomainError, responseError } from '@/utils/domain-error'

export const ROUTE_PATH = '/files' as const

export async function action({ request }: ActionFunctionArgs) {
  try {
    await AuthService.requireLoggedIn(request, true)

    const params = Object.fromEntries(new URL(request.url).searchParams)
    const user = (await AuthService.me(request)) as any
    const fileMaxSize =
      user?.project_features?.file_upload_size_limit?.value ||
      getSharedEnv('storage.fileMaxSize')

    switch (request.method) {
      case 'POST': {
        const fileKey = params.key

        if (!fileKey) {
          throw new DomainError('Bad request', 400)
        }

        const uploadHandler = unstable_composeUploadHandlers(
          async ({ name, contentType, data, filename }) => {
            if (name !== 'file') return undefined

            const uploadedFile = await unstable_createFileUploadHandler({
              maxPartSize: fileMaxSize,
              directory: getSharedEnv('storage.filePath'),
              file: () => fileKey,
            })({
              name,
              data,
              filename,
              contentType,
            })

            return uploadedFile
          },
          unstable_createMemoryUploadHandler(),
        )
        const formData = await unstable_parseMultipartFormData(request, uploadHandler)

        return json({ data: formData.entries })
      }

      case 'DELETE': {
        const key = params.key
        if (!key) {
          throw new DomainError('Bad request', 400)
        }

        try {
          const filePath = `./${getSharedEnv('storage.filePath')}/${key}`
          await unlink(resolvePath(filePath))
        } catch (err) {}

        return json({})
      }
    }
  } catch (err: unknown) {
    return await responseError(request, err, true)
  }
}
