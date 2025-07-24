'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
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
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';

const navItems = [
  { href: '/dashboard', label: 'Painel de Controle', icon: LayoutDashboard },
  { href: '/enrollment', label: 'Cadastro Biométrico', icon: UserPlus },
  { href: '/verification', label: 'Verificação de Identidade', icon: ScanFace },
  { href: '/epi-system', label: 'Sistema de Empréstimo de EPIs', icon: Construction },
  { href: '/materials', label: 'Gestão de Materiais', icon: Construction },
  { href: '/history', label: 'Histórico de Transações', icon: History },
];

const secondaryNavItems = [
  { href: '/settings', label: 'Configuração do Sistema', icon: Settings },
  { href: '/help', label: 'Ajuda & Suporte', icon: HelpCircle },
]

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: 'Logout realizado',
        description: 'Você foi desconectado com sucesso.',
      });
      router.push('/login');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro no logout',
        description: 'Erro ao desconectar. Tente novamente.',
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Sidebar para Desktop - Fixo */}
        <Sidebar className="hidden md:flex fixed left-0 top-0 z-50 h-screen w-64 border-r bg-sidebar flex-col">
          <SidebarHeader className="p-4 border-b border-sidebar-border">
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

          <SidebarContent className="p-2 flex-1 overflow-y-auto">
            <SidebarMenu className="space-y-1">
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

            <SidebarMenu className="mt-auto space-y-1">
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="https://placehold.co/100x100.png" alt="@shadcn" data-ai-hint="user avatar" />
                  <AvatarFallback>{user?.name ? user.name.slice(0, 2).toUpperCase() : 'US'}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-sm">
                  <span className="font-medium text-sidebar-foreground">{user?.name || 'Usuário'}</span>
                  <span className="text-sidebar-foreground/70 text-xs">{user?.email || 'email@domain.com'}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-sidebar-foreground/70 hover:text-sidebar-foreground h-8 w-8"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                <span className="sr-only">Sair</span>
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Sidebar Mobile - Overlay */}
        {isMobileSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setIsMobileSidebarOpen(false)}>
            <div className="fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border flex flex-col" onClick={(e) => e.stopPropagation()}>
              <SidebarHeader className="p-4 border-b border-sidebar-border">
                <div className="flex items-center justify-between">
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
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="text-sidebar-foreground/70 h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </SidebarHeader>

              <SidebarContent className="p-2 flex-1 overflow-y-auto">
                <SidebarMenu className="space-y-1">
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                        tooltip={item.label}
                        className="justify-start"
                        onClick={() => setIsMobileSidebarOpen(false)}
                      >
                        <Link href={item.href}>
                          <item.icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>

                <SidebarMenu className="mt-auto space-y-1">
                  {secondaryNavItems.map((item) => (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                        tooltip={item.label}
                        className="justify-start"
                        onClick={() => setIsMobileSidebarOpen(false)}
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="https://placehold.co/100x100.png" alt="@shadcn" data-ai-hint="user avatar" />
                      <AvatarFallback>{user?.name ? user.name.slice(0, 2).toUpperCase() : 'US'}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-sm">
                      <span className="font-medium text-sidebar-foreground">{user?.name || 'Usuário'}</span>
                      <span className="text-sidebar-foreground/70 text-xs">{user?.email || 'email@domain.com'}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-sidebar-foreground/70 hover:text-sidebar-foreground h-8 w-8"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="sr-only">Sair</span>
                  </Button>
                </div>
              </SidebarFooter>
            </div>
          </div>
        )}

        {/* Conteúdo Principal */}
        <div className="flex flex-col flex-1 md:ml-2">
          <header className="flex h-14 items-center gap-4 border-b px-4 sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
              <span className="sr-only">Abrir menu</span>
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold tracking-tight">Central de Controle de EPI</h1>
            </div>
          </header>

          <main className="flex-1 p-4 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
