import { useEffect, useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Check, X } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import { authApi } from '../../api/auth';

const plans = [
  {
    id: 1,
    name: 'STARTER',
    price: 29,
    period: 'month',
    durationMonths: 1,
    popular: false,
    features: [
      { key: 'featureGymAccess', included: true },
      { key: 'featureBasicEquipment', included: true },
      { key: 'featureLockerRoom', included: true },
      { key: 'featureGroupClasses', included: false },
      { key: 'featurePersonalTrainer', included: false },
      { key: 'featureNutritionPlan', included: false },
      { key: 'featureSaunaSpa', included: false },
    ]
  },
  {
    id: 2,
    name: 'PREMIUM',
    price: 59,
    period: 'month',
    durationMonths: 1,
    popular: true,
    features: [
      { key: 'featureGymAccess', included: true },
      { key: 'featureAllEquipment', included: true },
      { key: 'featureLockerRoom', included: true },
      { key: 'featureGroupClasses', included: true },
      { key: 'featurePersonalTrainer', included: true },
      { key: 'featureNutritionPlan', included: false },
      { key: 'featureSaunaSpa', included: false },
    ]
  },
  {
    id: 3,
    name: 'ELITE',
    price: 99,
    period: 'month',
    durationMonths: 1,
    popular: false,
    features: [
      { key: 'featureGymAccess', included: true },
      { key: 'featureAllEquipment', included: true },
      { key: 'featureLockerRoom', included: true },
      { key: 'featureGroupClasses', included: true },
      { key: 'featurePersonalTrainer', included: true },
      { key: 'featureNutritionPlan', included: true },
      { key: 'featureSaunaSpa', included: true },
    ]
  },
];

export function MembershipPlans() {
  const { t } = useI18n();
  const [userId, setUserId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const currentUser = authApi.getUser();
    setUserId(currentUser?.id || null);
  }, []);

  const handlePurchase = async (planName: string, durationMonths: number) => {
    if (!userId) {
      alert(t('membershipPlans', 'noUser'));
      return;
    }
    const now = new Date();
    const expiry = new Date(now);
    expiry.setMonth(expiry.getMonth() + durationMonths);

    try {
      setIsSaving(true);
      const response = await authApi.updateCurrentUser(userId, {
        membership: planName,
        membership_status: 'active',
        expiry_date: expiry.toISOString(),
      });
      const updatedUser = response?.user || response;
      if (updatedUser) {
        const stored = authApi.getUser() || {};
        const next = {
          ...stored,
          membership: updatedUser.membership ?? planName,
          membership_status: updatedUser.membership_status ?? 'active',
          expiry_date: updatedUser.expiry_date ?? expiry.toISOString(),
        };
        localStorage.setItem('user', JSON.stringify(next));
      }
      alert(t('membershipPlans', 'purchaseSuccess').replace('{plan}', planName));
    } catch {
      alert(t('membershipPlans', 'purchaseError'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-4 lg:p-8 pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl text-white mb-2 uppercase tracking-wider">{t('membershipPlans', 'title')}</h1>
          <p className="text-muted-foreground">{t('membershipPlans', 'subtitle')}</p>
        </div>

        {/* Plan Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`bg-card border-2 p-6 relative ${
                plan.popular ? 'border-primary' : 'border-border'
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-black border-0">
                  {t('membershipPlans', 'mostPopular')}
                </Badge>
              )}
              
              <div className="text-center mb-6 pt-2">
                <h3 className="text-xl text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl text-primary">${plan.price}</span>
                  <span className="text-muted-foreground">/{t('membershipPlans', 'perMonth')}</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    {feature.included ? (
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    )}
                    <span className={feature.included ? 'text-white' : 'text-muted-foreground'}>
                      {t('membershipPlans', feature.key)}
                    </span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => handlePurchase(plan.name, plan.durationMonths)}
                disabled={isSaving}
                className={`w-full ${
                  plan.popular
                    ? 'bg-primary hover:bg-primary/90 text-black'
                    : 'bg-secondary hover:bg-secondary/90 text-white'
                }`}
              >
                {t('membershipPlans', 'select')} {plan.name}
              </Button>
            </Card>
          ))}
        </div>

        {/* Comparison Table */}
        <Card className="bg-card border-border p-6">
          <h3 className="text-xl text-white mb-6 uppercase tracking-wider">{t('membershipPlans', 'comparison')}</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 text-muted-foreground">{t('membershipPlans', 'feature')}</th>
                  {plans.map(plan => (
                    <th key={plan.id} className="text-center py-3 text-white">{plan.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {plans[0].features.map((_, idx) => (
                  <tr key={idx} className="border-b border-border/50">
                    <td className="py-3 text-white">{t('membershipPlans', plans[0].features[idx].key)}</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="text-center py-3">
                        {plan.features[idx].included ? (
                          <Check className="w-5 h-5 text-primary mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-muted-foreground mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
