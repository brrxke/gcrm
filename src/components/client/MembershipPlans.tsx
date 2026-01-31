import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Check, X } from 'lucide-react';

const plans = [
  {
    id: 1,
    name: 'STARTER',
    price: 29,
    period: 'month',
    popular: false,
    features: [
      { name: 'Gym Access', included: true },
      { name: 'Basic Equipment', included: true },
      { name: 'Locker Room', included: true },
      { name: 'Group Classes', included: false },
      { name: 'Personal Trainer', included: false },
      { name: 'Nutrition Plan', included: false },
      { name: 'Sauna & Spa', included: false },
    ]
  },
  {
    id: 2,
    name: 'PREMIUM',
    price: 59,
    period: 'month',
    popular: true,
    features: [
      { name: 'Gym Access', included: true },
      { name: 'All Equipment', included: true },
      { name: 'Locker Room', included: true },
      { name: 'Group Classes', included: true },
      { name: 'Personal Trainer', included: true },
      { name: 'Nutrition Plan', included: false },
      { name: 'Sauna & Spa', included: false },
    ]
  },
  {
    id: 3,
    name: 'ELITE',
    price: 99,
    period: 'month',
    popular: false,
    features: [
      { name: 'Gym Access', included: true },
      { name: 'All Equipment', included: true },
      { name: 'Locker Room', included: true },
      { name: 'Group Classes', included: true },
      { name: 'Personal Trainer', included: true },
      { name: 'Nutrition Plan', included: true },
      { name: 'Sauna & Spa', included: true },
    ]
  },
];

export function MembershipPlans() {
  const handlePurchase = (planName: string) => {
    alert(`Payment integration would process ${planName} plan purchase here`);
  };

  return (
    <div className="min-h-screen bg-black p-4 lg:p-8 pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl text-white mb-2 uppercase tracking-wider">Choose Your Path</h1>
          <p className="text-muted-foreground">Select the plan that matches your goals</p>
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
                  MOST POPULAR
                </Badge>
              )}
              
              <div className="text-center mb-6 pt-2">
                <h3 className="text-xl text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl text-primary">${plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
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
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => handlePurchase(plan.name)}
                className={`w-full ${
                  plan.popular
                    ? 'bg-primary hover:bg-primary/90 text-black'
                    : 'bg-secondary hover:bg-secondary/90 text-white'
                }`}
              >
                Select {plan.name}
              </Button>
            </Card>
          ))}
        </div>

        {/* Comparison Table */}
        <Card className="bg-card border-border p-6">
          <h3 className="text-xl text-white mb-6 uppercase tracking-wider">Plan Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 text-muted-foreground">Feature</th>
                  {plans.map(plan => (
                    <th key={plan.id} className="text-center py-3 text-white">{plan.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {plans[0].features.map((_, idx) => (
                  <tr key={idx} className="border-b border-border/50">
                    <td className="py-3 text-white">{plans[0].features[idx].name}</td>
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
