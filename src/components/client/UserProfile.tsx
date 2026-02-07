import { useEffect, useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { User, Mail, Phone, Calendar, Share2, Clock } from 'lucide-react';
import { authApi } from '../../api/auth';
import { useI18n } from '../../context/I18nContext';

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
  const { t } = useI18n();
  const [profile, setProfile] = useState<{ name?: string; email?: string; phone?: string; age?: number } | null>(authApi.getUser());

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await authApi.getCurrentUser();
        const user = response?.user || response;
        if (user) {
          setProfile({
            name: user.name,
            email: user.email,
            phone: user.phone,
            age: user.age,
          });
        }
      } catch {
        // Keep localStorage fallback if API is unavailable.
      }
    };
    loadProfile();
  }, []);

  return (
    <div className="min-h-screen bg-black p-4 lg:p-8 pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl text-white uppercase tracking-wider">{t('client', 'profile')}</h1>

        {/* Personal Info */}
        <Card className="bg-card border-border p-6">
          <h3 className="text-xl text-white mb-6">{t('client', 'personalInfo')}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">{t('client', 'fullName')}</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="name"
                  defaultValue={profile?.name || ''}
                  className="pl-10 bg-input border-border text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">{t('common', 'email')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  defaultValue={profile?.email || ''}
                  className="pl-10 bg-input border-border text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white">{t('common', 'phone')}</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  defaultValue={profile?.phone || ''}
                  className="pl-10 bg-input border-border text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="age" className="text-white">{t('client', 'age')}</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="age"
                  type="number"
                  min={12}
                  max={120}
                  defaultValue={profile?.age ?? ''}
                  className="pl-10 bg-input border-border text-white"
                />
              </div>
            </div>
          </div>
          <Button className="mt-6 bg-primary hover:bg-primary/90 text-black">
            {t('client', 'updateProfile')}
          </Button>
        </Card>

        {/* Visit History Chart */}
        <Card className="bg-card border-border p-6">
          <h3 className="text-xl text-white mb-6">{t('client', 'visitHistory')}</h3>
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
              <div className="text-muted-foreground text-sm mb-2 uppercase">{t('client', 'membershipExpiresIn')}</div>
              <div className="text-4xl text-white flex items-baseline gap-2">
                {daysUntilExpiry}
                <span className="text-lg text-muted-foreground">{t('client', 'days')}</span>
              </div>
            </div>
            <Clock className="w-12 h-12 text-primary" />
          </div>
          <Button className="mt-4 bg-primary hover:bg-primary/90 text-black w-full md:w-auto">
            {t('client', 'renewNow')}
          </Button>
        </Card>

        {/* Referral Code */}
        <Card className="bg-card border-border p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl text-white mb-2">{t('client', 'referralCode')}</h3>
              <p className="text-muted-foreground text-sm">{t('client', 'shareWithFriends')}</p>
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
                {t('client', 'copy')}
              </Button>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-card border-border p-6">
          <h3 className="text-xl text-white mb-6">{t('client', 'notificationSettings')}</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white">{t('client', 'pushNotifications')}</div>
                <div className="text-sm text-muted-foreground">{t('client', 'pushNotificationsDesc')}</div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white">{t('client', 'emailNotifications')}</div>
                <div className="text-sm text-muted-foreground">{t('client', 'emailNotificationsDesc')}</div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white">{t('client', 'classReminders')}</div>
                <div className="text-sm text-muted-foreground">{t('client', 'classRemindersDesc')}</div>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
