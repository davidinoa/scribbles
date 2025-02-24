import {
  SignedIn,
  UserButton,
  SignOutButton,
  SignedOut,
  SignInButton,
  SignUpButton,
} from '@clerk/tanstack-start'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sign-in')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-700/30 p-8">
        <SignedIn>
          <div className="space-y-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome Back!
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              You are signed in to your account
            </p>

            <div className="flex justify-center">
              <UserButton />
            </div>

            <div className="pt-4">
              <div className="w-full bg-red-600 dark:bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors">
                <SignOutButton />
              </div>
            </div>
          </div>
        </SignedIn>

        <SignedOut>
          <div className="space-y-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome to Scribbles
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Please sign in to continue
            </p>

            <div className="space-y-3">
              <div className="w-full bg-blue-600 dark:bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                <SignInButton />
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    or
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-800 dark:bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors">
                <SignUpButton />
              </div>
            </div>
          </div>
        </SignedOut>
      </div>
    </div>
  )
}
