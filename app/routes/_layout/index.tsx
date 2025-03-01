import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'
import { NoteEditor } from '~/components/note-editor'
import { getWebRequest } from 'vinxi/http'
import { getAuth } from '@clerk/tanstack-start/server'

export const Route = createFileRoute('/_layout/')({
  component: Home,
  beforeLoad: async () => await authStateFn(),
})

const authStateFn = createServerFn({ method: 'GET' }).handler(async () => {
  const { userId } = await getAuth(getWebRequest())

  if (!userId) {
    throw redirect({
      to: '/sign-in',
    })
  }

  return { userId }
})

function Home() {
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-2">
        <div className="max-w-screen-sm mx-auto">
          <NoteEditor />
        </div>
      </div>
    </div>
  )
}
