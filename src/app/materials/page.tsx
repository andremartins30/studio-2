import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, PlusCircle } from "lucide-react";

const equipmentData = [
  { id: "EPI001", type: "Capacete de Segurança", assignedTo: "Maria Souza", status: "Entregue", lastActivity: "2024-07-29" },
  { id: "EPI002", type: "Luvas de Proteção", assignedTo: "N/A", status: "Em Estoque", lastActivity: "2024-07-29" },
  { id: "EPI003", type: "Botas com Bico de Aço", assignedTo: "Carlos Pereira", status: "Entregue", lastActivity: "2024-07-29" },
  { id: "EPI004", type: "Óculos de Segurança", assignedTo: "Ana Costa", status: "Entregue", lastActivity: "2024-07-29" },
  { id: "EPI005", type: "Colete de Alta Visibilidade", assignedTo: "N/A", status: "Em Estoque", lastActivity: "2024-07-28" },
  { id: "EPI006", type: "Máscara Respiratória", assignedTo: "Pedro Lima", status: "Entregue", lastActivity: "2024-07-27" },
  { id: "EPI007", type: "Protetor Auricular", assignedTo: "N/A", status: "Manutenção", lastActivity: "2024-07-26" },
  { id: "EPI008", type: "Cinto de Segurança", assignedTo: "Ricardo Jorge", status: "Entregue", lastActivity: "2024-07-25" },
];

function StatusBadge({ status }: { status: string }) {
    let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'secondary';
    if (status === 'Entregue') variant = 'default';
    if (status === 'Manutenção') variant = 'destructive';
    if (status === 'Em Estoque') variant = 'outline';

    const colorClass = status === 'Entregue' ? 'bg-orange-500' : status === 'Em Estoque' ? 'bg-green-500' : '';
    
    return <Badge variant={variant} className={colorClass}>{status}</Badge>;
}

export default function MaterialsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Gestão de Materiais"
        description="Acompanhe a entrega, devolução e descarte de todos os equipamentos."
      />
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Inventário de Equipamentos</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                 <Input placeholder="Buscar equipamento..." className="pl-8" />
              </div>
              <Button className="bg-accent hover:bg-accent/90">
                <PlusCircle className="mr-2 h-4 w-4"/>
                Adicionar Equipamento
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID do Equipamento</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Atribuído a</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Última Atividade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipmentData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono">{item.id}</TableCell>
                  <TableCell className="font-medium">{item.type}</TableCell>
                  <TableCell>{item.assignedTo}</TableCell>
                  <TableCell>
                    <StatusBadge status={item.status} />
                  </TableCell>
                  <TableCell className="text-right">{item.lastActivity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
