import { useEffect, useRef } from 'react'
import { cn } from '~/lib/utils'

type TextareaProps = React.ComponentProps<'textarea'>

export function Textarea({
  className,
  ref: externalRef,
  ...props
}: TextareaProps) {
  const internalRef = useRef<HTMLTextAreaElement>(null)

  function setRefs(element: HTMLTextAreaElement) {
    internalRef.current = element
    if (externalRef) {
      if (typeof externalRef === 'function') {
        externalRef(element)
      } else {
        externalRef.current = element
      }
    }
  }

  useEffect(() => {
    function adjustHeight() {
      const textarea = internalRef.current
      if (!textarea) return
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
    adjustHeight()
  }, [props.value])

  return (
    <textarea
      ref={setRefs}
      className={cn(
        'flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className,
      )}
      {...props}
    />
  )
}
