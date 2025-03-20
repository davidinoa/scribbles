import {
  createFileRoute,
  Link,
  Outlet,
  retainSearchParams,
  useLoaderData,
  useSearch,
} from '@tanstack/react-router'
import { z } from 'zod'
import { SearchInput } from '~/components/search-input'
import { Button } from '~/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '~/components/ui/sidebar'
import { fetchNotes } from '~/utils/notes'

export const Route = createFileRoute('/playground')({
  component: RouteComponent,
  loaderDeps: ({ search }) => ({
    filterBy: search.filterBy,
  }),
  validateSearch: z.object({
    filterBy: z.string().optional(),
  }).parse,
  search: {
    middlewares: [retainSearchParams(['filterBy'])],
  },
  loader: async ({ deps }) => {
    const notes = await fetchNotes({ data: { filterBy: deps.filterBy } })
    return {
      notes,
    }
  },
})

function RouteComponent() {
  const data = useLoaderData({ from: '/playground' })

  return (
    <SidebarProvider>
      <div className="grid h-screen w-screen grid-cols-[auto_1fr]">
        <PlaygroundSidebar />
        <div className="flex h-screen flex-col">
          <PlaygroundHeader />
          <div className="grid grow grid-cols-[auto_1fr]">
            <div className="flex h-full flex-col border-r border-border p-8">
              <ul className="flex-1">
                {data.notes.map((note) => (
                  <li key={note.id}>
                    <Link to="/playground/$noteId" params={{ noteId: note.id }}>
                      {note.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-8 max-sm:hidden">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}

function PlaygroundSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Button variant="ghost" asChild>
                  <Link to="/">Home</Link>
                </Button>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

function PlaygroundHeader() {
  const { filterBy = '' } = useSearch({ from: '/playground' })
  return (
    <header className="flex w-full items-center justify-between gap-6 border-b border-border p-4">
      <h1 className="flex items-center gap-2 text-2xl font-bold">
        <SidebarTrigger className="text-muted-foreground" />
        Playground
      </h1>
      <SearchInput search={filterBy} className="max-w-sm" />
    </header>
  )
}
