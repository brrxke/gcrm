import { useEffect, useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Calendar } from '../ui/calendar';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import { authApi } from '../../api/auth';

const timeSlots = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

export function TrialBooking() {
  const { t } = useI18n();
  const currentUser = authApi.getUser();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await authApi.getCurrentUser();
        const user = response?.user || response;
        if (!user) {
          return;
        }
        setName((prev) => prev || user.name || '');
        setEmail((prev) => prev || user.email || '');
        setPhone((prev) => prev || user.phone || '');
      } catch {
        // Fallback to localStorage data; no hard failure on profile load.
      }
    };
    loadProfile();
  }, []);

  const handleBooking = () => {
    if (!date || !selectedTime || !name || !email) {
      alert(t('trialBooking', 'fillRequired'));
      return;
    }
    alert(t('trialBooking', 'booked')
      .replace('{date}', date.toLocaleDateString())
      .replace('{time}', selectedTime)
    );
  };

  return (
    <div className="min-h-screen bg-black p-4 lg:p-8 pb-24 lg:pb-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl text-white mb-2 uppercase tracking-wider">{t('trialBooking', 'title')}</h1>
          <p className="text-muted-foreground">{t('trialBooking', 'subtitle')}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Calendar */}
          <Card className="bg-card border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <CalendarIcon className="w-5 h-5 text-primary" />
              <h3 className="text-white">{t('trialBooking', 'selectDate')}</h3>
            </div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => date < new Date()}
              className="rounded-md border-border"
            />
          </Card>

          {/* Time Slots */}
          <Card className="bg-card border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="text-white">{t('trialBooking', 'selectTime')}</h3>
            </div>
            <div className="grid grid-cols-3 gap-2 max-h-[350px] overflow-y-auto">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`p-3 rounded-md border transition-all ${
                    selectedTime === time
                      ? 'bg-primary text-black border-primary'
                      : 'bg-muted text-white border-border hover:border-primary'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Contact Form */}
        <Card className="bg-card border-border p-6">
          <h3 className="text-white mb-6">{t('trialBooking', 'yourInfo')}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">{t('trialBooking', 'fullNameRequired')}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('trialBooking', 'namePlaceholder')}
                className="bg-input border-border text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">{t('trialBooking', 'emailRequired')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('trialBooking', 'emailPlaceholder')}
                className="bg-input border-border text-white"
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="phone" className="text-white">{t('trialBooking', 'phone')}</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('trialBooking', 'phonePlaceholder')}
                className="bg-input border-border text-white"
              />
            </div>
          </div>
        </Card>

        {/* Summary & Confirm */}
        {date && selectedTime && (
          <Card className="bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/50 p-6">
            <h3 className="text-white mb-4">{t('trialBooking', 'summary')}</h3>
            <div className="space-y-2 text-muted-foreground mb-6">
              <p>{t('trialBooking', 'date')}: <span className="text-white">{date.toLocaleDateString()}</span></p>
              <p>{t('trialBooking', 'time')}: <span className="text-white">{selectedTime}</span></p>
              <p>{t('trialBooking', 'duration')}: <span className="text-white">{t('trialBooking', 'durationValue')}</span></p>
            </div>
            <Button
              onClick={handleBooking}
              className="w-full bg-primary hover:bg-primary/90 text-black"
            >
              {t('trialBooking', 'confirm')}
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
