import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { User, Mail, Phone, Calendar, Share2, Clock } from 'lucide-react';

const visitData = [
  { month: 'Jan', visits: 12 },
  { month: 'Feb', visits: 15 },
  { month: 'Mar', visits: 18 },
  { month: 'Apr', visits: 14 },
  { month: 'May', visits: 20 },
  { month: 'Jun', visits: 22 },
];

export function UserProfile() {
  const daysUntilExpiry = 45;
  const referralCode = 'IRON-X7K2M';

  return (
    <div className="min-h-screen bg-black p-4 lg:p-8 pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl text-white uppercase tracking-wider">Profile</h1>

        {/* Personal Info */}
        <Card className="bg-card border-border p-6">
          <h3 className="text-xl text-white mb-6">Personal Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="name"
                  defaultValue="John Warrior"
                  className="pl-10 bg-input border-border text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  defaultValue="john@example.com"
                  className="pl-10 bg-input border-border text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  defaultValue="+1 234 567 8900"
                  className="pl-10 bg-input border-border text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob" className="text-white">Date of Birth</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="dob"
                  type="date"
                  defaultValue="1995-06-15"
                  className="pl-10 bg-input border-border text-white"
                />
              </div>
            </div>
          </div>
          <Button className="mt-6 bg-primary hover:bg-primary/90 text-black">
            Update Profile
          </Button>
        </Card>

        {/* Visit History Chart */}
        <Card className="bg-card border-border p-6">
          <h3 className="text-xl text-white mb-6">Visit History</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={visitData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0a0a0a', 
                    border: '1px solid #333',
                    borderRadius: '6px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="visits" fill="#00d4ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Membership Expiry */}
        <Card className="bg-gradient-to-r from-secondary/20 to-primary/20 border-secondary/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-muted-foreground text-sm mb-2">MEMBERSHIP EXPIRES IN</div>
              <div className="text-4xl text-white flex items-baseline gap-2">
                {daysUntilExpiry}
                <span className="text-lg text-muted-foreground">days</span>
              </div>
            </div>
            <Clock className="w-12 h-12 text-primary" />
          </div>
          <Button className="mt-4 bg-primary hover:bg-primary/90 text-black w-full md:w-auto">
            Renew Now
          </Button>
        </Card>

        {/* Referral Code */}
        <Card className="bg-card border-border p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl text-white mb-2">Referral Code</h3>
              <p className="text-muted-foreground text-sm">Share with friends and earn rewards</p>
            </div>
            <Share2 className="w-6 h-6 text-primary" />
          </div>
          <div className="flex gap-2">
            <Input
              value={referralCode}
              readOnly
              className="bg-input border-border text-white text-lg tracking-wider"
            />
            <Button 
              onClick={() => navigator.clipboard.writeText(referralCode)}
              className="bg-primary hover:bg-primary/90 text-black"
            >
              Copy
            </Button>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-card border-border p-6">
          <h3 className="text-xl text-white mb-6">Notification Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white">Push Notifications</div>
                <div className="text-sm text-muted-foreground">Get updates about your membership</div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white">Email Notifications</div>
                <div className="text-sm text-muted-foreground">Receive news and promotions</div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white">Class Reminders</div>
                <div className="text-sm text-muted-foreground">Reminder before scheduled classes</div>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}