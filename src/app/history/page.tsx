'use client';

import { PageHeader } from "@/components/page-header";
import { ProtectedPage } from "@/components/protected-page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


const historyData = [
  { id: "TXN742", employee: "Maria Souza (Matrícula: 301)", action: "Entregue", equipment: "Capacete de Segurança", confirmation: "Verificado", date: "2024-07-29 10:45" },
  { id: "TXN741", employee: "João Silva (Matrícula: 102)", action: "Devolvido", equipment: "Luvas de Proteção", confirmation: "Verificado", date: "2024-07-29 10:30" },
  { id: "TXN740", employee: "Carlos Pereira (Matrícula: 512)", action: "Entregue", equipment: "Botas com Bico de Aço", confirmation: "Falhou", date: "2024-07-29 09:15" },
  { id: "TXN739", employee: "Ana Costa (Matrícula: 220)", action: "Entregue", equipment: "Óculos de Segurança", confirmation: "Verificado", date: "2024-07-29 08:50" },
  { id: "TXN738", employee: "Lucas Martins (Matrícula: 431)", action: "Devolvido", equipment: "Colete de Alta Visibilidade", confirmation: "Verificado", date: "2024-07-28 17:30" },
  { id: "TXN737", employee: "Sofia Almeida (Matrícula: 604)", action: "Entregue", equipment: "Máscara Respiratória", confirmation: "Verificado", date: "2024-07-28 16:12" },
  { id: "TXN736", employee: "Bruno Ferreira (Matrícula: 115)", action: "Entregue", equipment: "Protetor Auricular", confirmation: "Liberação Manual", date: "2024-07-28 14:00" },
  { id: "TXN735", employee: "Ricardo Jorge (Matrícula: 813)", action: "Devolvido", equipment: "Cinto de Segurança", confirmation: "Verificado", date: "2024-07-28 13:45" },
];

function ConfirmationBadge({ status }: { status: string }) {
  let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'secondary';
  if (status === 'Verificado') variant = 'default';
  if (status === 'Falhou') variant = 'destructive';
  if (status === 'Liberação Manual') variant = 'outline';

  const colorClass = status === 'Verificado' ? 'bg-green-600' : '';

  return <Badge variant={variant} className={colorClass}>{status}</Badge>;
}

export default function HistoryPage() {
  return (
    <ProtectedPage>
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Histórico de Transações"
          description="Veja um registro completo de transações de equipamentos e status de confirmação biométrica."
        />

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <CardTitle>Todas as Transações</CardTitle>
              <div className="flex w-full md:w-auto items-center gap-2">
                <div className="relative flex-1 md:flex-initial">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Buscar por funcionário, equipamento..." className="pl-8" />
                </div>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por ação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Ações</SelectItem>
                    <SelectItem value="issued">Entregues</SelectItem>
                    <SelectItem value="returned">Devolvidos</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <FileDown className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID da Transação</TableHead>
                  <TableHead>Funcionário</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Equipamento</TableHead>
                  <TableHead>Confirmação</TableHead>
                  <TableHead className="text-right">Data e Hora</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historyData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono">{item.id}</TableCell>
                    <TableCell className="font-medium">{item.employee}</TableCell>
                    <TableCell>
                      <Badge variant={item.action === 'Entregue' ? 'secondary' : 'outline'}>{item.action}</Badge>
                    </TableCell>
                    <TableCell>{item.equipment}</TableCell>
                    <TableCell>
                      <ConfirmationBadge status={item.confirmation} />
                    </TableCell>
                    <TableCell className="text-right">{item.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ProtectedPage>
  );
}
