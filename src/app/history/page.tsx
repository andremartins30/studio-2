import { PageHeader } from "@/components/page-header";
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
} from "@/components/ui/select"


const historyData = [
  { id: "TXN742", employee: "Maria Souza (ID: 301)", action: "Issued", equipment: "Safety Helmet", confirmation: "Verified", date: "2024-07-29 10:45 AM" },
  { id: "TXN741", employee: "João Silva (ID: 102)", action: "Returned", equipment: "Protective Gloves", confirmation: "Verified", date: "2024-07-29 10:30 AM" },
  { id: "TXN740", employee: "Carlos Pereira (ID: 512)", action: "Issued", equipment: "Steel Toe Boots", confirmation: "Failed", date: "2024-07-29 09:15 AM" },
  { id: "TXN739", employee: "Ana Costa (ID: 220)", action: "Issued", equipment: "Safety Goggles", confirmation: "Verified", date: "2024-07-29 08:50 AM" },
  { id: "TXN738", employee: "Lucas Martins (ID: 431)", action: "Returned", equipment: "High-Vis Vest", confirmation: "Verified", date: "2024-07-28 05:30 PM" },
  { id: "TXN737", employee: "Sofia Almeida (ID: 604)", action: "Issued", equipment: "Respirator Mask", confirmation: "Verified", date: "2024-07-28 04:12 PM" },
  { id: "TXN736", employee: "Bruno Ferreira (ID: 115)", action: "Issued", equipment: "Ear Protection", confirmation: "Manual Override", date: "2024-07-28 02:00 PM" },
  { id: "TXN735", employee: "Ricardo Jorge (ID: 813)", action: "Returned", equipment: "Safety Harness", confirmation: "Verified", date: "2024-07-28 01:45 PM" },
];

function ConfirmationBadge({ status }: { status: string }) {
    let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'secondary';
    if (status === 'Verified') variant = 'default';
    if (status === 'Failed') variant = 'destructive';
    if (status === 'Manual Override') variant = 'outline';
    
    const colorClass = status === 'Verified' ? 'bg-green-600' : '';

    return <Badge variant={variant} className={colorClass}>{status}</Badge>;
}


export default function HistoryPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Transaction History"
        description="View a complete log of equipment transactions and biometric confirmation statuses."
      />
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <CardTitle>All Transactions</CardTitle>
            <div className="flex w-full md:w-auto items-center gap-2">
              <div className="relative flex-1 md:flex-initial">
                 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                 <Input placeholder="Search by employee, equipment..." className="pl-8" />
              </div>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="issued">Issued</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <FileDown className="mr-2 h-4 w-4"/>
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Equipment</TableHead>
                <TableHead>Confirmation</TableHead>
                <TableHead className="text-right">Date & Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historyData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono">{item.id}</TableCell>
                  <TableCell className="font-medium">{item.employee}</TableCell>
                  <TableCell>
                     <Badge variant={item.action === 'Issued' ? 'secondary' : 'outline'}>{item.action}</Badge>
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
  );
}
