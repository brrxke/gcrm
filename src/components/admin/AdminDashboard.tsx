import { Card } from '../ui/card';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Users, TrendingUp, DollarSign, Activity } from 'lucide-react';

const visitData = [
  { date: 'Mon', visits: 145 },
  { date: 'Tue', visits: 178 },
  { date: 'Wed', visits: 165 },
  { date: 'Thu', visits: 192 },
  { date: 'Fri', visits: 210 },
  { date: 'Sat', visits: 234 },
  { date: 'Sun', visits: 198 },
];

const popularHours = [
  { hour: '6AM', count: 45 },
  { hour: '8AM', count: 67 },
  { hour: '10AM', count: 34 },
  { hour: '12PM', count: 28 },
  { hour: '2PM', count: 41 },
  { hour: '4PM', count: 52 },
  { hour: '6PM', count: 89 },
  { hour: '8PM', count: 71 },
];

const membershipDistribution = [
  { name: 'Starter', value: 120, color: '#00d4ff' },
  { name: 'Premium', value: 230, color: '#ff6600' },
  { name: 'Elite', value: 85, color: '#00ff88' },
];

export function AdminDashboard() {
  const stats = [
    {
      label: 'Active Members',
      value: '435',
      change: '+12%',
      icon: Users,
      color: 'text-primary'
    },
    {
      label: 'Monthly Revenue',
      value: '$24,580',
      change: '+8%',
      icon: DollarSign,
      color: 'text-primary'
    },
    {
      label: 'Today\'s Visits',
      value: '198',
      change: '+5%',
      icon: Activity,
      color: 'text-primary'
    },
    {
      label: 'Expiring Soon',
      value: '23',
      change: '-2%',
      icon: TrendingUp,
      color: 'text-secondary'
    },
  ];

  return (
    <div className="min-h-screen bg-black p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl text-white uppercase tracking-wider">Dashboard</h1>
          <p className="text-muted-foreground">Overview of gym performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <Card key={idx} className="bg-card border-border p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl text-white">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div className={`text-sm ${stat.change.startsWith('+') ? 'text-primary' : 'text-secondary'}`}>
                {stat.change} from last month
              </div>
            </Card>
          ))}
        </div>

        {/* Visit Statistics */}
        <Card className="bg-card border-border p-6">
          <h3 className="text-white mb-6">Visit Statistics</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visitData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a0a0a',
                    border: '1px solid #333',
                    borderRadius: '6px',
                    color: '#fff'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="visits"
                  stroke="#00d4ff"
                  strokeWidth={2}
                  dot={{ fill: '#00d4ff', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Popular Hours */}
          <Card className="bg-card border-border p-6">
            <h3 className="text-white mb-6">Popular Hours</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={popularHours}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="hour" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0a0a0a',
                      border: '1px solid #333',
                      borderRadius: '6px',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="count" fill="#ff3333" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Membership Distribution */}
          <Card className="bg-card border-border p-6">
            <h3 className="text-white mb-6">Membership Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={membershipDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {membershipDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0a0a0a',
                      border: '1px solid #333',
                      borderRadius: '6px',
                      color: '#fff'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4">
              {membershipDistribution.map((item) => (
                <div key={item.name} className="text-center">
                  <div className="text-2xl text-white">{item.value}</div>
                  <div className="text-xs text-muted-foreground">{item.name}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Active vs Expired */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-primary/20 to-transparent border-primary/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">ACTIVE MEMBERSHIPS</p>
                <p className="text-4xl text-white">412</p>
              </div>
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/20 to-transparent border-secondary/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">EXPIRED MEMBERSHIPS</p>
                <p className="text-4xl text-white">23</p>
              </div>
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-secondary" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}