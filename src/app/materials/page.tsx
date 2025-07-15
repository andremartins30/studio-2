import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, PlusCircle } from "lucide-react";

const equipmentData = [
  { id: "EPI001", type: "Safety Helmet", assignedTo: "Maria Souza", status: "Issued", lastActivity: "2024-07-29" },
  { id: "EPI002", type: "Protective Gloves", assignedTo: "N/A", status: "In Stock", lastActivity: "2024-07-29" },
  { id: "EPI003", type: "Steel Toe Boots", assignedTo: "Carlos Pereira", status: "Issued", lastActivity: "2024-07-29" },
  { id: "EPI004", type: "Safety Goggles", assignedTo: "Ana Costa", status: "Issued", lastActivity: "2024-07-29" },
  { id: "EPI005", type: "High-Vis Vest", assignedTo: "N/A", status: "In Stock", lastActivity: "2024-07-28" },
  { id: "EPI006", type: "Respirator Mask", assignedTo: "Pedro Lima", status: "Issued", lastActivity: "2024-07-27" },
  { id: "EPI007", type: "Ear Protection", assignedTo: "N/A", status: "Maintenance", lastActivity: "2024-07-26" },
  { id: "EPI008", type: "Safety Harness", assignedTo: "Ricardo Jorge", status: "Issued", lastActivity: "2024-07-25" },
];

function StatusBadge({ status }: { status: string }) {
    let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'secondary';
    if (status === 'Issued') variant = 'default';
    if (status === 'Maintenance') variant = 'destructive';
    if (status === 'In Stock') variant = 'outline';

    const colorClass = status === 'Issued' ? 'bg-orange-500' : status === 'In Stock' ? 'bg-green-500' : '';
    
    return <Badge variant={variant} className={colorClass}>{status}</Badge>;
}

export default function MaterialsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Material Management"
        description="Track issue, return, and disposal of all equipment."
      />
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Equipment Inventory</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                 <Input placeholder="Search equipment..." className="pl-8" />
              </div>
              <Button className="bg-accent hover:bg-accent/90">
                <PlusCircle className="mr-2 h-4 w-4"/>
                Add Equipment
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipment ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Last Activity</TableHead>
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
