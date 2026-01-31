import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Badge } from '../ui/badge';
import { CreditCard, AlertTriangle, User, Calendar } from 'lucide-react';

interface Membership {
  id: number;
  clientName: string;
  plan: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expiring' | 'expired';
  price: number;
}

const mockMemberships: Membership[] = [
  {
    id: 1,
    clientName: 'John Warrior',
    plan: 'Premium',
    startDate: '2024-06-15',
    endDate: '2025-06-15',
    status: 'active',
    price: 59
  },
  {
    id: 2,
    clientName: 'Sarah Strong',
    plan: 'Elite',
    startDate: '2024-08-20',
    endDate: '2025-08-20',
    status: 'active',
    price: 99
  },
  {
    id: 3,
    clientName: 'Mike Power',
    plan: 'Starter',
    startDate: '2024-01-10',
    endDate: '2025-01-10',
    status: 'expired',
    price: 29
  },
  {
    id: 4,
    clientName: 'Emma Fitness',
    plan: 'Premium',
    startDate: '2025-01-01',
    endDate: '2026-01-01',
    status: 'expiring',
    price: 59
  },
];

export function MembershipManagement() {
  const [memberships, setMemberships] = useState<Membership[]>(mockMemberships);
  const [isIssueDialogOpen, setIsIssueDialogOpen] = useState(false);
  const [newMembership, setNewMembership] = useState({
    clientName: '',
    plan: 'Starter',
    duration: '12'
  });

  const expiringCount = memberships.filter(m => m.status === 'expiring').length;
  const activeCount = memberships.filter(m => m.status === 'active').length;

  const handleIssueMembership = () => {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + parseInt(newMembership.duration));

    const prices = { Starter: 29, Premium: 59, Elite: 99 };

    const membership: Membership = {
      id: memberships.length + 1,
      clientName: newMembership.clientName,
      plan: newMembership.plan,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      status: 'active',
      price: prices[newMembership.plan as keyof typeof prices]
    };

    setMemberships([...memberships, membership]);
    setIsIssueDialogOpen(false);
    setNewMembership({ clientName: '', plan: 'Starter', duration: '12' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-primary/20 text-primary border-primary">Active</Badge>;
      case 'expiring':
        return <Badge className="bg-orange-500/20 text-orange-500 border-orange-500">Expiring Soon</Badge>;
      case 'expired':
        return <Badge className="bg-secondary/20 text-secondary border-secondary">Expired</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-white uppercase tracking-wider">Membership Management</h1>
            <p className="text-muted-foreground">Issue and manage memberships</p>
          </div>
          <Dialog open={isIssueDialogOpen} onOpenChange={setIsIssueDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-black">
                <CreditCard className="w-4 h-4 mr-2" />
                Issue Membership
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border text-white">
              <DialogHeader>
                <DialogTitle className="text-white">Issue New Membership</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="memberName" className="text-white">Client Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="memberName"
                      value={newMembership.clientName}
                      onChange={(e) => setNewMembership({ ...newMembership, clientName: e.target.value })}
                      className="pl-10 bg-input border-border text-white"
                      placeholder="Client name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="membershipPlan" className="text-white">Membership Plan</Label>
                  <select
                    id="membershipPlan"
                    value={newMembership.plan}
                    onChange={(e) => setNewMembership({ ...newMembership, plan: e.target.value })}
                    className="w-full px-3 py-2 bg-input border border-border text-white rounded-md"
                  >
                    <option value="Starter">Starter - $29/month</option>
                    <option value="Premium">Premium - $59/month</option>
                    <option value="Elite">Elite - $99/month</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-white">Duration</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <select
                      id="duration"
                      value={newMembership.duration}
                      onChange={(e) => setNewMembership({ ...newMembership, duration: e.target.value })}
                      className="w-full px-3 py-2 pl-10 bg-input border border-border text-white rounded-md"
                    >
                      <option value="1">1 Month</option>
                      <option value="3">3 Months</option>
                      <option value="6">6 Months</option>
                      <option value="12">12 Months</option>
                    </select>
                  </div>
                </div>
                <Button
                  onClick={handleIssueMembership}
                  className="w-full bg-primary hover:bg-primary/90 text-black"
                >
                  Issue Membership
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-primary/20 to-transparent border-primary/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">ACTIVE MEMBERSHIPS</p>
                <p className="text-4xl text-white">{activeCount}</p>
              </div>
              <CreditCard className="w-12 h-12 text-primary" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/20 to-transparent border-orange-500/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">EXPIRING SOON</p>
                <p className="text-4xl text-white">{expiringCount}</p>
              </div>
              <AlertTriangle className="w-12 h-12 text-orange-500" />
            </div>
          </Card>
        </div>

        {/* Expiring Soon Alert */}
        {expiringCount > 0 && (
          <Card className="bg-orange-500/10 border-orange-500 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-white mb-1">Memberships Expiring Soon</h3>
                <p className="text-sm text-muted-foreground">
                  {expiringCount} membership{expiringCount !== 1 ? 's' : ''} will expire within 30 days. Contact clients for renewal.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Active Memberships Table */}
        <Card className="bg-card border-border">
          <div className="p-6 border-b border-border">
            <h3 className="text-white">Active Memberships</h3>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Client</TableHead>
                  <TableHead className="text-muted-foreground">Plan</TableHead>
                  <TableHead className="text-muted-foreground">Start Date</TableHead>
                  <TableHead className="text-muted-foreground">End Date</TableHead>
                  <TableHead className="text-muted-foreground">Price</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {memberships.map((membership) => (
                  <TableRow key={membership.id} className="border-border hover:bg-muted/50">
                    <TableCell className="text-white">{membership.clientName}</TableCell>
                    <TableCell className="text-white">{membership.plan}</TableCell>
                    <TableCell className="text-white">{membership.startDate}</TableCell>
                    <TableCell className="text-white">{membership.endDate}</TableCell>
                    <TableCell className="text-white">${membership.price}/mo</TableCell>
                    <TableCell>{getStatusBadge(membership.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-transparent border-border text-white hover:bg-muted"
                        >
                          Renew
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-transparent border-border text-white hover:bg-muted"
                        >
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}
