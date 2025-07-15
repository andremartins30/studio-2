import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, Package, ScanFace, Activity } from "lucide-react";

const summaryData = [
  { title: "Total Users", value: "1,254", icon: Users, change: "+12%" },
  { title: "Equipment Issued", value: "832", icon: Package, change: "+5%" },
  { title: "Pending Returns", value: "42", icon: Package, change: "-3%", variant: "destructive" },
  { title: "Successful Verifications", value: "98.7%", icon: ScanFace, change: "+0.2%" },
];

const recentActivity = [
  { id: "TXN742", employee: "Maria Souza (ID: 301)", action: "Issued", equipment: "Safety Helmet", status: "Verified", date: "2024-07-29 10:45 AM" },
  { id: "TXN741", employee: "João Silva (ID: 102)", action: "Returned", equipment: "Protective Gloves", status: "Verified", date: "2024-07-29 10:30 AM" },
  { id: "TXN740", employee: "Carlos Pereira (ID: 512)", action: "Issued", equipment: "Steel Toe Boots", status: "Failed", date: "2024-07-29 09:15 AM" },
  { id: "TXN739", employee: "Ana Costa (ID: 220)", action: "Issued", equipment: "Safety Goggles", status: "Verified", date: "2024-07-29 08:50 AM" },
  { id: "TXN738", employee: "Lucas Martins (ID: 431)", action: "Returned", equipment: "High-Vis Vest", status: "Verified", date: "2024-07-28 05:30 PM" },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Dashboard" description="Welcome to the EPI Control Center. Here's a summary of current operations." />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryData.map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <p className="text-xs text-muted-foreground">{item.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5" />Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Equipment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivity.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium">{activity.employee}</TableCell>
                  <TableCell>
                    <Badge variant={activity.action === 'Issued' ? 'secondary' : 'outline'}>{activity.action}</Badge>
                  </TableCell>
                  <TableCell>{activity.equipment}</TableCell>
                  <TableCell>
                    <Badge variant={activity.status === 'Verified' ? 'default' : 'destructive'} className={activity.status === 'Verified' ? 'bg-green-600' : ''}>
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
  );
}
