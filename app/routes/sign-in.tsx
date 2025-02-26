import {
  ClerkLoaded,
  ClerkLoading,
  SignIn,
  useSignIn,
} from '@clerk/tanstack-start'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { demoLogin } from '~/lib/server-fns/demo-login'
import { Button } from '~/components/ui/button'
import { Spinner } from '~/components/spinner'

export const Route = createFileRoute('/sign-in')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, isLoaded } = useSignIn()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleDemoLogin() {
    if (!isLoaded) return
    try {
      setIsLoading(true)
      setErrorMessage(null)
      const credentials = await demoLogin()

      const signInAttempt = await signIn.create({
        identifier: credentials.email,
        password: credentials.password,
      })

      if (signInAttempt.status === 'complete') {
        navigate({ to: '/' })
      } else {
        throw new Error(
          'Sign-in requires additional steps. Please complete the sign-in process.',
        )
      }
    } catch (error) {
      console.error('Error signing in with demo account:', error)
      setErrorMessage(
        'There was a problem signing in with the demo account. Please try again.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-screen w-screen place-items-center grid">
      <ClerkLoading>
        <div className="flex flex-col items-center justify-center">
          <Spinner className="h-8 w-8 mb-4" />
          <p className="text-muted-foreground">Loading authentication...</p>
        </div>
      </ClerkLoading>
      <ClerkLoaded>
        <div className="grid place-items-center h-screen">
          <div className="flex flex-col items-center gap-6 w-full max-w-md px-4">
            <div className="w-full text-center space-y-3">
              <h2 className="text-lg font-medium">
                Want to try before signing up?
              </h2>
              <p className="text-sm text-muted-foreground">
                Click below to explore the app with a demo account. No sign-up
                required.
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleDemoLogin}
                disabled={isLoading || !isLoaded}
              >
                {isLoading ? <Spinner className="mr-2 h-4 w-4" /> : null}
                {isLoading ? 'Signing in...' : 'Try Demo Mode'}
              </Button>

              {errorMessage && (
                <p className="text-sm text-destructive mt-2">{errorMessage}</p>
              )}
            </div>

            <div className="relative w-full my-2">
              <hr className="border-t border-border" />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
                OR
              </span>
            </div>

            <SignIn />
          </div>
        </div>
      </ClerkLoaded>
    </div>
  )
}
