import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { DefaultCatchBoundary } from '../components/default-catch-boundary'
import { NotFound } from '../components/not-found'
import appCss from '../styles/app.css?url'
import { seo } from '../utils/seo'
import { ClerkProvider } from '@clerk/tanstack-start'
import { createServerFn } from '@tanstack/start'
import { getAuth } from '@clerk/tanstack-start/server'
import { getWebRequest } from '@tanstack/start/server'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      ...seo({
        title: 'Scribbles',
        description: `Scribbles is a simple note-taking app.`,
      }),
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      { rel: 'manifest', href: '/site.webmanifest', color: '#fffff' },
      { rel: 'icon', href: '/favicon.ico' },
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: true,
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Pacifico&display=swap',
      },
    ],
  }),
  beforeLoad: async () => {
    const { userId } = await fetchClerkAuth()
    return {
      userId,
    }
  },
  pendingComponent: () => <div>Loading...</div>,
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    )
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
})

function RootComponent() {
  return (
    <ClerkProvider>
      <RootDocument>
        <Outlet />
      </RootDocument>
    </ClerkProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const isDev = import.meta.env.DEV
  return (
    <html className="dark">
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        {children}
        {isDev && <TanStackRouterDevtools position="bottom-right" />}
        <Scripts />
      </body>
    </html>
  )
}

const fetchClerkAuth = createServerFn({ method: 'GET' }).handler(async () => {
  const { userId } = await getAuth(getWebRequest()!)

  return {
    userId,
  }
})
