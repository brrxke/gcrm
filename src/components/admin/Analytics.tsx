import { Card } from '../ui/card';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Users, DollarSign, Award } from 'lucide-react';

const revenueData = [
  { month: 'Jul', revenue: 18500, expenses: 8200 },
  { month: 'Aug', revenue: 21200, expenses: 8400 },
  { month: 'Sep', revenue: 19800, expenses: 8100 },
  { month: 'Oct', revenue: 23400, expenses: 8600 },
  { month: 'Nov', revenue: 22100, expenses: 8300 },
  { month: 'Dec', revenue: 24580, expenses: 8500 },
];

const trainerStats = [
  { name: 'Coach Marcus', clients: 45, rating: 4.9 },
  { name: 'Sarah Lee', clients: 38, rating: 4.8 },
  { name: 'Mike Johnson', clients: 42, rating: 4.7 },
  { name: 'Emma Davis', clients: 35, rating: 4.9 },
  { name: 'Alex Stone', clients: 29, rating: 4.6 },
];

const membershipPopularity = [
  { type: 'Premium', count: 230, color: '#ff6600' },
  { type: 'Starter', count: 120, color: '#00d4ff' },
  { type: 'Elite', count: 85, color: '#00ff88' },
];

const attendanceData = [
  { day: 'Mon', morning: 65, afternoon: 45, evening: 95 },
  { day: 'Tue', morning: 72, afternoon: 52, evening: 102 },
  { day: 'Wed', morning: 68, afternoon: 48, evening: 88 },
  { day: 'Thu', morning: 78, afternoon: 55, evening: 110 },
  { day: 'Fri', morning: 85, afternoon: 62, evening: 125 },
  { day: 'Sat', morning: 92, afternoon: 78, evening: 115 },
  { day: 'Sun', morning: 88, afternoon: 70, evening: 98 },
];

export function Analytics() {
  const totalRevenue = revenueData[revenueData.length - 1].revenue;
  const revenueGrowth = ((revenueData[revenueData.length - 1].revenue - revenueData[0].revenue) / revenueData[0].revenue * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-black p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl text-white uppercase tracking-wider">Analytics</h1>
          <p className="text-muted-foreground">Detailed performance metrics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card border-border p-6">
            <div className="flex items-start justify-between mb-2">
              <p className="text-muted-foreground text-sm">MONTHLY REVENUE</p>
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
            <p className="text-3xl text-white mb-1">${totalRevenue.toLocaleString()}</p>
            <p className="text-sm text-primary">+{revenueGrowth}% growth</p>
          </Card>

          <Card className="bg-card border-border p-6">
            <div className="flex items-start justify-between mb-2">
              <p className="text-muted-foreground text-sm">TOTAL MEMBERS</p>
              <Users className="w-6 h-6 text-primary" />
            </div>
            <p className="text-3xl text-white mb-1">435</p>
            <p className="text-sm text-primary">+12% this month</p>
          </Card>

          <Card className="bg-card border-border p-6">
            <div className="flex items-start justify-between mb-2">
              <p className="text-muted-foreground text-sm">AVG. ATTENDANCE</p>
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <p className="text-3xl text-white mb-1">187</p>
            <p className="text-sm text-primary">Daily average</p>
          </Card>

          <Card className="bg-card border-border p-6">
            <div className="flex items-start justify-between mb-2">
              <p className="text-muted-foreground text-sm">TOP TRAINER</p>
              <Award className="w-6 h-6 text-primary" />
            </div>
            <p className="text-3xl text-white mb-1">4.9</p>
            <p className="text-sm text-primary">Coach Marcus</p>
          </Card>
        </div>

        {/* Revenue Chart */}
        <Card className="bg-card border-border p-6">
          <h3 className="text-white mb-6">Revenue vs Expenses</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
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
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#00d4ff"
                  strokeWidth={3}
                  dot={{ fill: '#00d4ff', r: 5 }}
                  name="Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#ff6600"
                  strokeWidth={3}
                  dot={{ fill: '#ff6600', r: 5 }}
                  name="Expenses"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Two Column Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Trainer Stats */}
          <Card className="bg-card border-border p-6">
            <h3 className="text-white mb-6">Popular Trainers</h3>
            <div className="space-y-4">
              {trainerStats.map((trainer, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-black">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-white">{trainer.name}</p>
                      <p className="text-sm text-muted-foreground">{trainer.clients} clients</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-primary text-lg">{trainer.rating}</span>
                    <span className="text-primary">★</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Membership Type Popularity */}
          <Card className="bg-card border-border p-6">
            <h3 className="text-white mb-6">Membership Type Popularity</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={membershipPopularity}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ type, count }) => `${type}: ${count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {membershipPopularity.map((entry, index) => (
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
              {membershipPopularity.map((item) => (
                <div key={item.type} className="text-center">
                  <div className="text-2xl text-white">{item.count}</div>
                  <div className="text-xs text-muted-foreground">{item.type}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Attendance Trends */}
        <Card className="bg-card border-border p-6">
          <h3 className="text-white mb-6">Attendance Trends by Time</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="day" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a0a0a',
                    border: '1px solid #333',
                    borderRadius: '6px',
                    color: '#fff'
                  }}
                />
                <Legend />
                <Bar dataKey="morning" fill="#00d4ff" radius={[4, 4, 0, 0]} name="Morning (6AM-12PM)" />
                <Bar dataKey="afternoon" fill="#ff6600" radius={[4, 4, 0, 0]} name="Afternoon (12PM-6PM)" />
                <Bar dataKey="evening" fill="#ff3333" radius={[4, 4, 0, 0]} name="Evening (6PM-12AM)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-primary/20 to-transparent border-primary/50 p-6">
            <p className="text-muted-foreground text-sm mb-2">RETENTION RATE</p>
            <p className="text-4xl text-white mb-2">94.2%</p>
            <p className="text-sm text-primary">+2.1% from last month</p>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/20 to-transparent border-secondary/50 p-6">
            <p className="text-muted-foreground text-sm mb-2">AVG. SESSION TIME</p>
            <p className="text-4xl text-white mb-2">87 min</p>
            <p className="text-sm text-primary">+5 min increase</p>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/20 to-transparent border-orange-500/50 p-6">
            <p className="text-muted-foreground text-sm mb-2">NEW MEMBERS</p>
            <p className="text-4xl text-white mb-2">52</p>
            <p className="text-sm text-primary">This month</p>
          </Card>
        </div>
      </div>
    </div>
  );
}