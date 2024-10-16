import { createRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import type { Project } from '@/components/types'
import ProjectsService from '@/modules/projects/service.client'

interface FlatSurfaceRendererProps {
  assetBaseUrl?: string
  project: Project
  onLoad?: () => void
  onProgress?: (event: any) => void
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': MyElementAttributes
    }

    interface MyElementAttributes {
      id: any
      ref: any
      src: string
      children: any
      [key: string]: any
    }
  }
}

const FlatSurfaceRenderer = ({
  assetBaseUrl,
  project,
  onLoad,
  onProgress,
}: FlatSurfaceRendererProps) => {
  const { t } = useTranslation()
  const contentDisplay = ProjectsService.getContentDisplay(project)
  const viewerRef = createRef<any>()

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    viewerRef.current.addEventListener('load', onLoad)
    viewerRef.current.addEventListener('progress', onProgress)

    return () => {
      viewerRef.current.removeEventListener('load', onLoad)
      viewerRef.current.removeEventListener('progress', onProgress)
    }
  }, [])

  return (
    <div
      id="container"
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <model-viewer
        id="model-viewer"
        ref={viewerRef}
        src={`${assetBaseUrl}/files/${contentDisplay?.content?.media?.main?.storage_meta?.key}`}
        environment-image="neutral"
        loading="eager"
        camera-controls
        ar
        ar-modes="webxr scene-viewer quick-look"
        autoplay
        shadow-intensity="1.5"
        tone-mapping="neutral"
      >
        <button type="button" slot="ar-button">
          {t('common.View in space')}
        </button>

        <div className="progress-bar hide" slot="progress-bar">
          <div className="update-bar" />
        </div>

        <div id="ar-prompt">
          {/* biome-ignore lint/a11y/useAltText: <explanation> */}
          <img src="/images/ar_hand_prompt.png" />
        </div>
      </model-viewer>
    </div>
  )
}

export default FlatSurfaceRenderer
