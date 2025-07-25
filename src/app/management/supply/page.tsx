'use client';

import { PageHeader } from "@/components/page-header";
import { ProtectedPage } from "@/components/protected-page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Package, Truck, AlertCircle } from "lucide-react";

// Dados mockados para fornecimento
const supplyData = [
    {
        id: "SUP001",
        supplier: "EPI Safety Corp",
        product: "Capacetes de Segurança",
        quantity: 50,
        expectedDate: "2024-08-15",
        status: "Pendente",
        priority: "Alta"
    },
    {
        id: "SUP002",
        supplier: "ProEquip Ltda",
        product: "Luvas de Proteção",
        quantity: 200,
        expectedDate: "2024-08-10",
        status: "Em Trânsito",
        priority: "Média"
    },
    {
        id: "SUP003",
        supplier: "SafeWork Industrial",
        product: "Botas com Bico de Aço",
        quantity: 75,
        expectedDate: "2024-08-20",
        status: "Entregue",
        priority: "Baixa"
    },
    {
        id: "SUP004",
        supplier: "EPI Safety Corp",
        product: "Óculos de Proteção",
        quantity: 100,
        expectedDate: "2024-08-12",
        status: "Atrasado",
        priority: "Alta"
    },
    {
        id: "SUP005",
        supplier: "Shield Protection",
        product: "Máscaras Respiratórias",
        quantity: 150,
        expectedDate: "2024-08-25",
        status: "Pendente",
        priority: "Média"
    }
];

function getStatusBadge(status: string) {
    const variants = {
        'Pendente': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        'Em Trânsito': 'bg-blue-100 text-blue-800 border-blue-200',
        'Entregue': 'bg-green-100 text-green-800 border-green-200',
        'Atrasado': 'bg-red-100 text-red-800 border-red-200'
    };

    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800 border-gray-200';
}

function getPriorityBadge(priority: string) {
    const variants = {
        'Alta': 'bg-red-100 text-red-800 border-red-200',
        'Média': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        'Baixa': 'bg-green-100 text-green-800 border-green-200'
    };

    return variants[priority as keyof typeof variants] || 'bg-gray-100 text-gray-800 border-gray-200';
}

export default function SupplyPage() {
    return (
        <ProtectedPage>
            <div className="flex flex-col gap-8">
                <PageHeader
                    title="Gestão de Fornecimento"
                    description="Controle e monitore pedidos de fornecimento de EPIs e materiais de segurança."
                />

                {/* Cards de Resumo */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pedidos Pendentes</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">2</div>
                            <p className="text-xs text-muted-foreground">Aguardando fornecedor</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Em Trânsito</CardTitle>
                            <Truck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1</div>
                            <p className="text-xs text-muted-foreground">A caminho do destino</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Entregues</CardTitle>
                            <Package className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1</div>
                            <p className="text-xs text-muted-foreground">Recebidos com sucesso</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Atrasados</CardTitle>
                            <AlertCircle className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1</div>
                            <p className="text-xs text-muted-foreground">Requer atenção</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Controles e Tabela */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Pedidos de Fornecimento</CardTitle>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Novo Pedido
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar pedidos..."
                                    className="pl-8"
                                />
                            </div>
                        </div>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Fornecedor</TableHead>
                                        <TableHead>Produto</TableHead>
                                        <TableHead>Quantidade</TableHead>
                                        <TableHead>Data Esperada</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Prioridade</TableHead>
                                        <TableHead>Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {supplyData.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{item.id}</TableCell>
                                            <TableCell>{item.supplier}</TableCell>
                                            <TableCell>{item.product}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>{item.expectedDate}</TableCell>
                                            <TableCell>
                                                <Badge className={getStatusBadge(item.status)}>
                                                    {item.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getPriorityBadge(item.priority)}>
                                                    {item.priority}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="outline" size="sm">
                                                    Detalhes
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </ProtectedPage>
    );
}
