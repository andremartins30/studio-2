'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  ShieldCheck,
  LayoutDashboard,
  UserPlus,
  ScanFace,
  Construction,
  History,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const navItems = [
  { href: '/', label: 'Painel de Controle', icon: LayoutDashboard },
  { href: '/enrollment', label: 'Cadastro Biométrico', icon: UserPlus },
  { href: '/verification', label: 'Verificação de Identidade', icon: ScanFace },
  { href: '/materials', label: 'Gestão de Materiais', icon: Construction },
  { href: '/history', label: 'Histórico de Transações', icon: History },
];

const secondaryNavItems = [
    { href: '/settings', label: 'Configuração do Sistema', icon: Settings },
    { href: '/help', label: 'Ajuda & Suporte', icon: HelpCircle },
]

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-accent h-8 w-8">
              <ShieldCheck className="w-6 h-6" />
            </Button>
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold tracking-tight text-sidebar-foreground">
                EPI Control
              </h2>
              <p className="text-xs text-sidebar-foreground/70">Center</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                  className="justify-start"
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>

          <SidebarMenu className="mt-auto">
             {secondaryNavItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                  className="justify-start"
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
             <Avatar className="h-9 w-9">
              <AvatarImage src="https://placehold.co/100x100.png" alt="@shadcn" data-ai-hint="user avatar" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-sm">
                <span className="font-medium text-sidebar-foreground">Usuário Admin</span>
                <span className="text-sidebar-foreground/70">admin@epicontrol.com</span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-card px-6">
           <SidebarTrigger className="md:hidden" />
           <div className="flex-1">
             <h1 className="text-lg font-semibold tracking-tight">Central de Controle de EPI</h1>
           </div>
        </header>
        <main className="flex-1 p-6 md:p-8">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
