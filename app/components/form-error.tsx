type ErrorValue = string | undefined
type ErrorType = ErrorValue | ErrorValue[]

type FormErrorProps = {
  errors?: ErrorType
  className?: string
}

export function FormError({ errors, className }: FormErrorProps) {
  if (!errors) return null
  if (Array.isArray(errors) && errors.length === 0) return null
  const errorArray = Array.isArray(errors) ? errors : [errors]
  return (
    <div className={className}>
      {errorArray
        .filter((error): error is string => typeof error === 'string')
        .map((error, index) => (
          <p key={index} className="text-sm font-medium text-destructive">
            {error}
          </p>
        ))}
    </div>
  )
}
