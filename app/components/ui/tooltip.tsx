import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { useState } from 'react'

interface TooltipProps extends Omit<TooltipPrimitive.TooltipContentProps, 'content'> {
  content:
    | React.ReactNode
    | string
    | ((props: { setOpen: (open: boolean) => void }) => React.ReactNode)
}

const Tooltip = ({ children, content, side = 'top' }: TooltipProps) => {
  const [open, setOpen] = useState(false)

  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root open={open} onOpenChange={setOpen} delayDuration={0}>
        <TooltipPrimitive.Trigger
          asChild
          onClick={() => {
            setOpen(true)
          }}
          onBlur={() => {
            setOpen(false)
          }}
        >
          {children}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            sideOffset={8}
            side={side}
            className="animate-slide-up-fade z-[99] items-center overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm"
            collisionPadding={0}
          >
            {typeof content === 'string' ? (
              <span className="block max-w-xs text-pretty px-4 py-2 text-center text-sm text-gray-700">
                {content}
              </span>
            ) : typeof content === 'function' ? (
              content({ setOpen })
            ) : (
              content
            )}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}

export { type TooltipProps, Tooltip }
