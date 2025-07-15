import { PageHeader } from "@/components/page-header";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, Package, ScanFace, Activity } from "lucide-react";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const summaryData = [
    { title: "Total de Usuários", value: "1.254", icon: Users, change: "+12% do último mês" },
    { title: "Equipamentos Entregues", value: "832", icon: Package, change: "+5% do último mês" },
    { title: "Devoluções Pendentes", value: "42", icon: Package, change: "-3% do último mês", variant: "destructive" },
    { title: "Verificações com Sucesso", value: "98,7%", icon: ScanFace, change: "+0.2% do último mês" },
];

const recentActivity = [
    { id: "TXN742", employee: "Maria Souza (Matrícula: 301)", action: "Entregue", equipment: "Capacete de Segurança", status: "Verificado", date: "2024-07-29 10:45" },
    { id: "TXN741", employee: "João Silva (Matrícula: 102)", action: "Devolvido", equipment: "Luvas de Proteção", status: "Verificado", date: "2024-07-29 10:30" },
    { id: "TXN740", employee: "Carlos Pereira (Matrícula: 512)", action: "Entregue", equipment: "Botas com Bico de Aço", status: "Falhou", date: "2024-07-29 09:15" },
    { id: "TXN739", employee: "Ana Costa (Matrícula: 220)", action: "Entregue", equipment: "Óculos de Segurança", status: "Verificado", date: "2024-07-29 08:50" },
    { id: "TXN738", employee: "Lucas Martins (Matrícula: 431)", action: "Devolvido", equipment: "Colete de Alta Visibilidade", status: "Verificado", date: "2024-07-28 17:30" },
];

export default async function DashboardPage() {
    // Verifica se o usuário está autenticado
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token');

    if (!sessionToken) {
        // Usuário não autenticado, redireciona para login
        redirect('/login');
    }

    return (
        <AppLayout>
            <div className="flex flex-col gap-8">
                <PageHeader title="Painel de Controle" description="Bem-vindo à Central de Controle de EPI. Aqui está um resumo das operações atuais." />

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {summaryData.map((item, index) => (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                                <item.icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{item.value}</div>
                                <p className="text-xs text-muted-foreground">{item.change}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5" />Atividade Recente</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Funcionário</TableHead>
                                    <TableHead>Ação</TableHead>
                                    <TableHead>Equipamento</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Data</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentActivity.map((activity) => (
                                    <TableRow key={activity.id}>
                                        <TableCell className="font-medium">{activity.employee}</TableCell>
                                        <TableCell>
                                            <Badge variant={activity.action === 'Entregue' ? 'secondary' : 'outline'}>{activity.action}</Badge>
                                        </TableCell>
                                        <TableCell>{activity.equipment}</TableCell>
                                        <TableCell>
                                            <Badge variant={activity.status === 'Verificado' ? 'default' : 'destructive'} className={activity.status === 'Verificado' ? 'bg-green-600' : ''}>
                                                {activity.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">{activity.date}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
