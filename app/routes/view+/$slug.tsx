import { type ActionFunctionArgs, type MetaFunction, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { detect } from 'detect-browser'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ClientOnly } from 'remix-utils/client-only'

import FlatSurfaceRenderer from '@/components/projects/renderers/flat-surface'
import Logo from '@/components/shared/logo'
import { Button } from '@/components/ui/button'
import { getSharedEnvs } from '@/configs/utils'
import ProjectsService from '@/modules/projects/service.server'
import { responseError } from '@/utils/domain-error'

export const meta: MetaFunction = ({ data }: { data: any }) => {
  return [{ title: data.project.name }]
}

export async function loader({ request, params }: ActionFunctionArgs) {
  const url = new URL(request.url)
  const envs = getSharedEnvs()

  envs.url = {
    origin: url.origin,
    port: url.port,
  }

  try {
    const { slug } = params
    const project = await ProjectsService.findOne(slug as string)

    return json({ envs, project })
  } catch (err: unknown) {
    return await responseError(request, err)
  }
}

export default function Viewer() {
  const { envs, project } = useLoaderData<typeof loader>()
  const { t } = useTranslation()
  const [isOpened, setIsOpened] = useState(false)
  const [isSupportedBrowser, setIsSupportedBrowser] = useState<boolean>(false)
  const assetBaseUrl =
    envs.assetBaseUrl || envs.assetHostPort
      ? envs.url.origin.replace(envs.url.port, envs.assetHostPort)
      : ''

  const onOpen = () => {
    setIsOpened(true)
  }

  const onLoad = () => {
    setTimeout(removeLauncher, 600)
    hideLauncher()
  }

  const showLauncher = () => {
    const $launcherBody = document.querySelectorAll('#launcher .launcher-body')
    $launcherBody?.[0]?.classList?.remove('opacity-0')
  }

  const hideLauncher = () => {
    const $launcher = document.getElementById('launcher')
    $launcher?.classList?.add('launcher-hide')
  }

  const removeLauncher = () => {
    const $launcher = document.getElementById('launcher')
    $launcher?.remove()
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    setIsSupportedBrowser(
      ['chrome', 'firefox', 'safari', 'ios', 'crios'].includes(detect()?.name || ''),
    )
    setTimeout(showLauncher, 600)
  }, [])

  return (
    <>
      <script
        type="module"
        src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"
      />

      <ClientOnly>
        {() => (
          <>
            {isSupportedBrowser === false && (
              <>
                <div className="flex h-screen w-full flex-col items-center justify-center gap-8 rounded-md bg-card px-6">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-2xl font-medium text-primary">Whoops!</p>
                    <p className="text-center text-lg font-normal text-primary/60">
                      {t('error.No supported browser')}
                    </p>
                  </div>
                </div>
              </>
            )}

            {isSupportedBrowser && (
              <>
                <div id="launcher" className={isOpened ? 'launcher-loading' : ''}>
                  <div className="launcher-body opacity-0">
                    <div className="launcher-content">
                      <div className="launcher-logo">
                        <Logo />
                        <div className="launcher-loading">
                          <div className="launcher-spinner" />
                        </div>
                      </div>

                      <div className="launcher-action">
                        <Button
                          variant="outline"
                          rounded="2xl"
                          className="text-white bg-pink-600 hover:bg-pink-600 w-64"
                          textWrapperClassName="font-bold text-base"
                          text={t('common.Launch')}
                          onClick={onOpen}
                        />
                      </div>
                    </div>

                    <div className="launcher-note text-lg	text-white">
                      {t('message.Launcher markerless guide')}
                    </div>
                  </div>
                </div>

                {isOpened && (
                  <FlatSurfaceRenderer
                    assetBaseUrl={assetBaseUrl}
                    project={project}
                    onLoad={onLoad}
                  />
                )}
              </>
            )}
          </>
        )}
      </ClientOnly>
    </>
  )
}
