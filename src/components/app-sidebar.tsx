import * as React from "react"
import {
  ArrowUpCircleIcon,
  BarChartIcon,
  CalendarIcon,
  ClipboardListIcon,
  DatabaseIcon,
  DollarSignIcon,
  FileIcon,
  FolderIcon,
  HelpCircleIcon,
  HomeIcon,
  LayoutDashboardIcon,
  PieChartIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "User",
    email: "user@example.com",
    avatar: "/avatars/user.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Assets",
      url: "#",
      icon: HomeIcon,
    },
    {
      title: "Analytics",
      url: "#",
      icon: BarChartIcon,
    },
    {
      title: "Ownership",
      url: "#",
      icon: PieChartIcon,
    },
    {
      title: "Team",
      url: "#",
      icon: UsersIcon,
    },
  ],
  navClouds: [
    {
      title: "Bookings",
      icon: CalendarIcon,
      isActive: false,
      url: "#",
      items: [
        {
          title: "All Bookings",
          url: "#",
        },
        {
          title: "My Bookings",
          url: "#",
        },
      ],
    },
    {
      title: "Bills & Expenses",
      icon: DollarSignIcon,
      url: "#",
      items: [
        {
          title: "Recurring Bills",
          url: "#",
        },
        {
          title: "One-time Expenses",
          url: "#",
        },
      ],
    },
    {
      title: "Documents",
      icon: FolderIcon,
      url: "#",
      items: [
        {
          title: "All Documents",
          url: "#",
        },
        {
          title: "Contracts",
          url: "#",
        },
        {
          title: "Receipts",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: SettingsIcon,
    },
    {
      title: "Get Help",
      url: "#",
      icon: HelpCircleIcon,
    },
    {
      title: "Search",
      url: "#",
      icon: SearchIcon,
    },
  ],
  documents: [
    {
      name: "Asset Database",
      url: "#",
      icon: DatabaseIcon,
    },
    {
      name: "Reports",
      url: "#",
      icon: ClipboardListIcon,
    },
    {
      name: "Documents",
      url: "#",
      icon: FileIcon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">CoOwn</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
