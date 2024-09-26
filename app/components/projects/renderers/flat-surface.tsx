import { createRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import type { Project } from '@/components/types'
import ProjectsService from '@/modules/projects/service.client'

interface FlatSurfaceRendererProps {
  project: Project
  onLoad?: () => void
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

const FlatSurfaceRenderer = ({ project, onLoad }: FlatSurfaceRendererProps) => {
  const { t } = useTranslation()
  const contentDisplay = ProjectsService.getContentDisplay(project)
  const viewerRef = createRef<any>()

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    viewerRef.current.addEventListener('load', () => {
      try {
        onLoad?.()
      } catch (err) {}
    })
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
        src={`/files/${contentDisplay?.content?.media?.main?.storage_meta?.key}`}
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
          {t('common.ViewInSpace')}
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
