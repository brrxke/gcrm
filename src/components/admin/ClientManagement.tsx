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
import { Search, UserPlus, Mail, Phone, User, Calendar } from 'lucide-react';

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  membership: string;
  status: 'active' | 'expired' | 'trial';
  joinDate: string;
  expiryDate: string;
}

const mockClients: Client[] = [
  {
    id: 1,
    name: 'John Warrior',
    email: 'john@example.com',
    phone: '+1 234 567 8900',
    membership: 'Premium',
    status: 'active',
    joinDate: '2024-06-15',
    expiryDate: '2025-06-15'
  },
  {
    id: 2,
    name: 'Sarah Strong',
    email: 'sarah@example.com',
    phone: '+1 234 567 8901',
    membership: 'Elite',
    status: 'active',
    joinDate: '2024-08-20',
    expiryDate: '2025-08-20'
  },
  {
    id: 3,
    name: 'Mike Power',
    email: 'mike@example.com',
    phone: '+1 234 567 8902',
    membership: 'Starter',
    status: 'expired',
    joinDate: '2024-01-10',
    expiryDate: '2025-01-10'
  },
  {
    id: 4,
    name: 'Emma Fitness',
    email: 'emma@example.com',
    phone: '+1 234 567 8903',
    membership: 'Premium',
    status: 'active',
    joinDate: '2024-09-05',
    expiryDate: '2025-09-05'
  },
  {
    id: 5,
    name: 'Alex Beast',
    email: 'alex@example.com',
    phone: '+1 234 567 8904',
    membership: 'Trial',
    status: 'trial',
    joinDate: '2026-01-10',
    expiryDate: '2026-01-17'
  },
];

export function ClientManagement() {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    membership: 'Starter'
  });

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || client.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleAddClient = () => {
    const client: Client = {
      id: clients.length + 1,
      ...newClient,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    setClients([...clients, client]);
    setIsAddDialogOpen(false);
    setNewClient({ name: '', email: '', phone: '', membership: 'Starter' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-primary/20 text-primary border-primary">Active</Badge>;
      case 'expired':
        return <Badge className="bg-secondary/20 text-secondary border-secondary">Expired</Badge>;
      case 'trial':
        return <Badge className="bg-muted text-white border-border">Trial</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-white uppercase tracking-wider">Client Management</h1>
            <p className="text-muted-foreground">Manage gym members</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-black">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Client
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border text-white">
              <DialogHeader>
                <DialogTitle className="text-white">Add New Client</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName" className="text-white">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="clientName"
                      value={newClient.name}
                      onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                      className="pl-10 bg-input border-border text-white"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientEmail" className="text-white">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="clientEmail"
                      type="email"
                      value={newClient.email}
                      onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                      className="pl-10 bg-input border-border text-white"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientPhone" className="text-white">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="clientPhone"
                      value={newClient.phone}
                      onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                      className="pl-10 bg-input border-border text-white"
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientMembership" className="text-white">Membership Plan</Label>
                  <select
                    id="clientMembership"
                    value={newClient.membership}
                    onChange={(e) => setNewClient({ ...newClient, membership: e.target.value })}
                    className="w-full px-3 py-2 bg-input border border-border text-white rounded-md"
                  >
                    <option value="Starter">Starter</option>
                    <option value="Premium">Premium</option>
                    <option value="Elite">Elite</option>
                  </select>
                </div>
                <Button
                  onClick={handleAddClient}
                  className="w-full bg-primary hover:bg-primary/90 text-black"
                >
                  Add Client
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <Card className="bg-card border-border p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or email..."
                className="pl-10 bg-input border-border text-white"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'active', 'expired', 'trial'].map((status) => (
                <Button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  variant={filterStatus === status ? 'default' : 'outline'}
                  className={filterStatus === status 
                    ? 'bg-primary text-black' 
                    : 'bg-transparent border-border text-white hover:bg-muted'
                  }
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Client Table */}
        <Card className="bg-card border-border">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Name</TableHead>
                  <TableHead className="text-muted-foreground">Contact</TableHead>
                  <TableHead className="text-muted-foreground">Membership</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Join Date</TableHead>
                  <TableHead className="text-muted-foreground">Expiry Date</TableHead>
                  <TableHead className="text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id} className="border-border hover:bg-muted/50">
                    <TableCell className="text-white">{client.name}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="text-white">{client.email}</div>
                        <div className="text-muted-foreground">{client.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-white">{client.membership}</TableCell>
                    <TableCell>{getStatusBadge(client.status)}</TableCell>
                    <TableCell className="text-white">{client.joinDate}</TableCell>
                    <TableCell className="text-white">{client.expiryDate}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => setSelectedClient(client)}
                        variant="outline"
                        size="sm"
                        className="bg-transparent border-border text-white hover:bg-muted"
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Client Details Dialog */}
        {selectedClient && (
          <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
            <DialogContent className="bg-card border-border text-white">
              <DialogHeader>
                <DialogTitle className="text-white">Client Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label className="text-muted-foreground">Name</Label>
                  <p className="text-white text-lg">{selectedClient.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="text-white">{selectedClient.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Phone</Label>
                  <p className="text-white">{selectedClient.phone}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Membership</Label>
                  <p className="text-white">{selectedClient.membership}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedClient.status)}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Join Date</Label>
                    <p className="text-white">{selectedClient.joinDate}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Expiry Date</Label>
                    <p className="text-white">{selectedClient.expiryDate}</p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
