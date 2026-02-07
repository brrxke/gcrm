import { useEffect, useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Users, Clock, CreditCard, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../context/I18nContext';
import { authApi } from '../../api/auth';

export function ClientDashboard() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [profile, setProfile] = useState<any>(authApi.getUser());

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await authApi.getCurrentUser();
        const user = response?.user || response;
        if (user) {
          setProfile(user);
        }
      } catch {
        // Keep localStorage fallback
      }
    };
    loadProfile();
  }, []);

  const membershipType = profile?.membership || t('clientDashboard', 'noMembership');
  const membershipStatus = profile?.membership_status || 'inactive';
  const expiryDate = profile?.expiry_date ? new Date(profile.expiry_date) : null;
  const daysUntilExpiry = expiryDate
    ? Math.max(0, Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  const occupancy = 72;
  const hours = { open: '05:00', close: '23:00' };

  return (
    <div className="min-h-screen bg-black p-4 lg:p-8 pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Membership Card */}
        <Card className="bg-gradient-to-br from-primary via-primary/90 to-secondary p-6 border-0">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-black/60 text-sm mb-1">{t('clientDashboard', 'membership')}</div>
              <h2 className="text-3xl text-black">{membershipType}</h2>
            </div>
            <Badge className="bg-black text-primary border-0">
              {membershipStatus === 'active' ? t('clientDashboard', 'active') : t('clientDashboard', 'inactive')}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-black/80 mt-6">
            <Clock className="w-4 h-4" />
            <span className="text-sm">
              {daysUntilExpiry !== null
                ? `${t('clientDashboard', 'expiresIn')} ${daysUntilExpiry} ${t('clientDashboard', 'days')}`
                : t('clientDashboard', 'noExpiry')}
            </span>
          </div>
        </Card>

        {/* Gym Status Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Occupancy Card */}
          <Card className="bg-card border-border p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-muted-foreground text-sm mb-2">{t('clientDashboard', 'gymOccupancy')}</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl text-white">{occupancy}%</span>
                  <span className={`text-sm ${occupancy > 70 ? 'text-secondary' : 'text-primary'}`}>
                    {occupancy > 70 ? t('clientDashboard', 'busy') : t('clientDashboard', 'available')}
                  </span>
                </div>
              </div>
              <Users className={`w-8 h-8 ${occupancy > 70 ? 'text-secondary' : 'text-primary'}`} />
            </div>
            <div className="w-full bg-muted rounded-full h-2 mt-4">
              <div 
                className={`h-2 rounded-full transition-all ${occupancy > 70 ? 'bg-secondary' : 'bg-primary'}`}
                style={{ width: `${occupancy}%` }}
              />
            </div>
          </Card>

          {/* Hours Card */}
          <Card className="bg-card border-border p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-muted-foreground text-sm mb-2">{t('clientDashboard', 'todaysHours')}</div>
                <div className="text-2xl text-white">{hours.open} - {hours.close}</div>
              </div>
              <Clock className="w-8 h-8 text-primary" />
            </div>
            <div className="text-sm text-muted-foreground mt-4">
              {t('clientDashboard', 'openSevenDays')}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="text-white uppercase tracking-wider text-sm">{t('clientDashboard', 'quickActions')}</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {membershipStatus !== 'active' && (
              <Button 
                onClick={() => navigate('/client/book')}
                className="bg-primary hover:bg-primary/90 text-black h-14 justify-start px-6"
              >
                <Calendar className="w-5 h-5 mr-3" />
                {t('clientDashboard', 'bookTrial')}
              </Button>
            )}
            <Button 
              onClick={() => navigate('/client/plans')}
              className="bg-secondary hover:bg-secondary/90 text-white h-14 justify-start px-6"
            >
              <CreditCard className="w-5 h-5 mr-3" />
              {membershipStatus === 'active'
                ? t('clientDashboard', 'manageMembership')
                : t('clientDashboard', 'addMembership')}
            </Button>
          </div>
        </div>

        {/* Motivational Banner */}
        <Card className="bg-gradient-to-r from-secondary/20 to-primary/20 border-secondary/50 p-6">
          <div className="text-center">
            <h3 className="text-2xl text-white mb-2">{t('clientDashboard', 'pushYourLimits')}</h3>
            <p className="text-muted-foreground">{t('clientDashboard', 'consistency')}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
