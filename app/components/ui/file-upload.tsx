import { type VariantProps, cva } from 'class-variance-authority'
import { UploadCloud } from 'lucide-react'
import { type DragEvent, type ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { cn } from '@/utils/misc'
import { Icons } from '../shared/icons'

const acceptFileTypes: Record<string, { types: string[]; extensions?: string[] }> = {
  any: { types: [] },
  images: {
    types: ['image/png', 'image/jpeg'],
    extensions: ['.png', '.jpg'],
  },
  csv: {
    types: ['text/csv'],
    extensions: ['.csv'],
  },
  threed: {
    types: ['model/gltf+json', 'model/gltf-binary', 'application/octet-stream'],
    extensions: ['.gltf', '.glb'],
  },
}

const imageUploadVariants = cva(
  'group relative isolate flex aspect-[1200/630] w-full flex-col items-center justify-center overflow-hidden bg-white transition-all hover:bg-gray-50',
  {
    variants: {
      variant: {
        default: 'rounded-md border border-gray-300 shadow-sm',
        plain: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

type FileUploadReadFileProps =
  | {
      /**
       * Whether to automatically read the file and return the result as `src` to onChange
       */
      readFile?: false
      onChange?: (data: { file: File }) => void
    }
  | {
      /**
       * Whether to automatically read the file and return the result as `src` to onChange
       */
      readFile: true
      onChange?: (data: { file: File; src: string }) => void
    }

type FileUploadProps = FileUploadReadFileProps & {
  accept: keyof typeof acceptFileTypes

  className?: string
  iconClassName?: string

  /**
   * Image to display (generally for image uploads)
   */
  imageSrc?: string | null

  /**
   * Current file name
   */
  currentFileName?: string

  /**
   * Whether to display a loading spinner
   */
  loading?: boolean

  /**
   * Whether to allow clicking on the area to upload
   */
  clickToUpload?: boolean

  /**
   * Whether to show instruction overlay when hovered
   */
  showHoverOverlay?: boolean

  /**
   * Content to display below the upload icon (null to only display the icon)
   */
  content?: ReactNode | null

  /**
   * Desired resolution to suggest and optionally resize to
   */
  targetResolution?: { width: number; height: number }

  /**
   * A maximum file size (in megabytes) to check upon file selection
   */
  maxFileSizeMB?: number

  /**
   * Accessibility label for screen readers
   */
  accessibilityLabel?: string

  disabled?: boolean
} & VariantProps<typeof imageUploadVariants>

const FileUpload = ({
  readFile,
  variant,
  className,
  iconClassName,
  accept = 'any',
  imageSrc,
  currentFileName,
  loading = false,
  clickToUpload = true,
  showHoverOverlay = true,
  content,
  maxFileSizeMB = 0,
  accessibilityLabel = 'File upload',
  disabled = false,
  onChange,
}: FileUploadProps) => {
  const { t } = useTranslation()
  const [dragActive, setDragActive] = useState(false)
  const [fileName, setFileName] = useState<string | undefined>(currentFileName)

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement> | DragEvent) => {
    const file = 'dataTransfer' in e ? e.dataTransfer.files?.[0] : e.target.files?.[0]
    if (!file) return

    setFileName(file.name)

    if (maxFileSizeMB > 0 && file.size / 1024 / 1024 > maxFileSizeMB) {
      toast.error(
        `${t('error.FileSizeTooBig')}  (${t('common.max')} ${maxFileSizeMB} MB)`,
      )
      return
    }

    const acceptedTypes = acceptFileTypes[accept].types

    if (acceptedTypes.length && file.type && !acceptedTypes.includes(file.type)) {
      toast.error(
        acceptFileTypes[accept].extensions
          ? t('error.FileOnlySupported', {
              extensions: acceptFileTypes[accept].extensions.join(','),
            })
          : t('error.FileIsInvalid'),
      )
      return
    }

    if (readFile) {
      const reader = new FileReader()
      reader.onload = (e) => onChange?.({ src: e.target?.result as string, file })
      reader.readAsDataURL(file)

      return
    }

    onChange?.({ file })
  }

  return (
    <label
      className={cn(
        imageUploadVariants({ variant }),
        !disabled ? cn(clickToUpload && 'cursor-pointer') : 'cursor-not-allowed',
        className,
      )}
    >
      {loading && (
        <div className="absolute inset-0 z-[5] flex items-center justify-center rounded-[inherit] bg-white">
          <Icons.spinner />
        </div>
      )}
      <div
        className="absolute inset-0 z-[5]"
        onDragOver={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setDragActive(true)
        }}
        onDragEnter={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setDragActive(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setDragActive(false)
        }}
        onDrop={async (e) => {
          e.preventDefault()
          e.stopPropagation()
          onFileChange(e)
          setDragActive(false)
        }}
      />
      <div
        className={cn(
          'absolute inset-0 z-[3] flex flex-col items-center justify-center rounded-[inherit] bg-white transition-all',
          disabled && 'bg-gray-50',
          dragActive &&
            !disabled &&
            'cursor-copy border-2 border-black bg-gray-50 opacity-100',
          imageSrc || fileName
            ? cn('opacity-0', showHoverOverlay && !disabled && 'group-hover:opacity-100')
            : cn(!disabled && 'group-hover:bg-gray-50'),
        )}
      >
        <UploadCloud
          className={cn(
            'size-7 transition-all duration-75',
            !disabled
              ? cn(
                  'text-gray-500 group-hover:scale-110 group-active:scale-95',
                  dragActive ? 'scale-110' : 'scale-100',
                )
              : 'text-gray-400',
            iconClassName,
          )}
        />
        {content !== null && (
          <div
            className={cn(
              'mt-2 text-center text-sm text-gray-500',
              disabled && 'text-gray-400',
            )}
          >
            {content ?? (
              <>
                <p>
                  {t('common.DragAndDrop')} {clickToUpload && t('common.orClick')}{' '}
                  {t('common.toUpload')}.
                </p>
              </>
            )}
          </div>
        )}
        <span className="sr-only">{accessibilityLabel}</span>
      </div>
      {imageSrc && (
        <img
          src={imageSrc}
          alt="Preview"
          className="h-full w-full rounded-[inherit] object-cover"
        />
      )}
      {fileName && (
        <div className="h-full w-full flex">
          <div className="m-auto font-bold text-gray-400">{fileName}</div>
        </div>
      )}
      {clickToUpload && (
        <div className="sr-only mt-1 flex shadow-sm">
          <input key={fileName} type="file" onChange={onFileChange} disabled={disabled} />
        </div>
      )}
    </label>
  )
}

export { type FileUploadProps, FileUpload }
