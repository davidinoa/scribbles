import { getAuth } from '@clerk/tanstack-start/server'
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'
import { toast } from 'sonner'
import { getWebRequest } from 'vinxi/http'
import { NoteEditor } from '~/components/note-editor'

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
  const router = useRouter()
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-2">
        <div className="mx-auto max-w-screen-sm">
          <NoteEditor
            onSuccess={() => {
              toast.success('Note created')
              router.navigate({ to: '/notes' })
            }}
          />
        </div>
      </div>
    </div>
  )
}
