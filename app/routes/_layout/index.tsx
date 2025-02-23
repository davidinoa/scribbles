import { createFileRoute, redirect, Router } from '@tanstack/react-router'
import {
  createServerValidate,
  getFormData,
  ServerValidateError,
} from '@tanstack/react-form/start'
import { createServerFn } from '@tanstack/start'
import { NoteEditor } from '~/components/note-editor'

export const Route = createFileRoute('/_layout/')({
  component: Home,
})

function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="max-w-screen-sm mx-auto">
          <NoteEditor />
        </div>
      </div>
    </div>
  )
}
