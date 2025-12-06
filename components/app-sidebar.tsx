"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, UploadCloud, FileText, Users, CreditCard, Bell, Settings, UserPlus, Landmark, ShoppingCart } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Create Admin",
    href: "/signup",
    icon: UserPlus,
  },
  {
    title: "Upload Logs",
    href: "/upload-logs",
    icon: UploadCloud,
  },
  {
    title: "All Logs",
    href: "/all-logs",
    icon: FileText,
  },
  {
    title: "Users",
    href: "/users",
    icon: Users,
  },
  {
    title: "Transactions",
    href: "/transactions",
    icon: CreditCard,
  },
  {
    title: "orders",
    href: "/orders",
    icon: ShoppingCart,
  },
  {
    title: "Withdrawals",
    href: "/withdrawals",
    icon: Landmark,
  },
  {
    title: "Notifications",
    href: "/notifications",
    icon: Bell,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarContent className="bg-sidebar">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground text-lg font-bold px-4 py-6">
            De’socialPlug
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                    >
                      <Link href={item.href}>
                        <Icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4 bg-sidebar">
        <p className="text-xs text-sidebar-foreground/60 text-center">© 2025 SocialLogs</p>
      </SidebarFooter>
    </Sidebar>
  )
}
