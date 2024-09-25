import { cva } from 'class-variance-authority'
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

import { cn } from '@/utils/misc'
import { CardListContext } from './list'

const cardVariants = cva('w-full group/card border-gray-200 bg-white', {
  variants: {
    variant: {
      compact:
        'first-of-type:rounded-t-lg last-of-type:rounded-b-lg first-of-type:border-t border-b border-x data-[hover-state-enabled=true]:hover:bg-gray-50 transition-colors',
      loose:
        'border rounded-lg transition-[filter] data-[hover-state-enabled=true]:hover:drop-shadow-card-hover',
    },
  },
})

const CardContext = createContext<{
  hovered: boolean
}>({ hovered: false })

const Card = ({
  id,
  outerClassName,
  innerClassName,
  children,
  hoverStateEnabled = true,
  onClick,
}: PropsWithChildren<{
  id?: string
  outerClassName?: string
  innerClassName?: string
  onClick?: () => void
  hoverStateEnabled?: boolean
}>) => {
  const { variant } = useContext(CardListContext)

  const ref = useRef<HTMLLIElement>(null)

  const [hovered, setHovered] = useState(false)

  // Detect when the card loses hover without an onPointerLeave (e.g. from a modal covering the element)
  useEffect(() => {
    if (!hovered || !ref.current) return

    // Check every second while the card is expected to still be hovered
    const interval = setInterval(() => {
      if (ref.current?.matches(':hover') === false) setHovered(false)
    }, 1000)

    return () => clearInterval(interval)
  }, [hovered])

  return (
    <li
      id={id}
      ref={ref}
      className={cn(cardVariants({ variant }), outerClassName)}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      data-hover-state-enabled={hoverStateEnabled}
    >
      {/* biome-ignore lint/a11y/useKeyWithClickEvents:*/}
      <div
        className={cn('w-full py-2.5 px-4', innerClassName)}
        onClick={
          onClick
            ? (e) => {
                const existingModalBackdrop = document.getElementById('modal-backdrop')

                // Don't trigger onClick if there's already an open modal
                if (existingModalBackdrop) {
                  return
                }

                // Traverse up the DOM tree to see if there's a clickable element between this card and the click
                for (
                  let target = e.target as HTMLElement, i = 0;
                  target && target !== e.currentTarget && i < 100; // Only go 100 levels deep
                  target = target.parentElement as HTMLElement, i++
                ) {
                  // Don't trigger onClick if a clickable element inside the card was clicked
                  if (
                    ['button', 'a', 'input', 'textarea'].includes(
                      target.tagName.toLowerCase(),
                    )
                  )
                    return
                }

                onClick()
              }
            : undefined
        }
      >
        <CardContext.Provider value={{ hovered }}>{children}</CardContext.Provider>
      </div>
    </li>
  )
}

export { CardContext, Card }
