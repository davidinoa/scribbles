import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Archive, Book, Home, LucideTag, Settings, Tag } from 'lucide-react'
import { fetchTags } from '~/lib/server-fns/fetch-tags'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from './ui/sidebar'

const mainItems = [
  {
    title: 'Home',
    url: '/',
    icon: Home,
  },
  {
    title: 'Notes',
    url: '/notes',
    icon: Book,
  },
  {
    title: 'Archive',
    url: '/archive',
    icon: Archive,
  },
  {
    title: 'Tags',
    url: '/tags',
    icon: Tag,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
  },
]

export function AppSidebar() {
  const activeLinkProps = {
    className: 'bg-accent text-accent-foreground',
    'data-active': 'true',
  }

  const tagsQuery = useQuery({
    queryKey: ['tags'],
    queryFn: fetchTags,
  })

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-col gap-2 p-4">
        <img src="/logo.svg" alt="Scribbles" className="size-8" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} activeProps={activeLinkProps}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Tags</SidebarGroupLabel>
          <SidebarMenu>
            {tagsQuery.data?.map((tag) => (
              <SidebarMenuItem key={tag.id}>
                <SidebarMenuButton asChild>
                  <Link
                    to="/tags/$tagName"
                    params={{ tagName: tag.name }}
                    activeProps={activeLinkProps}
                  >
                    <LucideTag className="size-4" />
                    <span>{tag.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
