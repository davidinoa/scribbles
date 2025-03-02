import { Archive, Book, Home, Settings, Tag } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
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

  return (
    <Sidebar>
      <SidebarHeader className="p-4 flex flex-col gap-2">
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
      </SidebarContent>
    </Sidebar>
  )
}
