import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Calendar } from '../ui/calendar';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';

const timeSlots = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

export function TrialBooking() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleBooking = () => {
    if (!date || !selectedTime || !name || !email) {
      alert('Please fill in all required fields');
      return;
    }
    alert(`Trial session booked for ${date.toLocaleDateString()} at ${selectedTime}`);
  };

  return (
    <div className="min-h-screen bg-black p-4 lg:p-8 pb-24 lg:pb-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl text-white mb-2 uppercase tracking-wider">Book Trial Session</h1>
          <p className="text-muted-foreground">Experience our gym with a free trial</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Calendar */}
          <Card className="bg-card border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <CalendarIcon className="w-5 h-5 text-primary" />
              <h3 className="text-white">Select Date</h3>
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
              <h3 className="text-white">Select Time</h3>
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
          <h3 className="text-white mb-6">Your Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Full Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="bg-input border-border text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="bg-input border-border text-white"
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="phone" className="text-white">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 234 567 8900"
                className="bg-input border-border text-white"
              />
            </div>
          </div>
        </Card>

        {/* Summary & Confirm */}
        {date && selectedTime && (
          <Card className="bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/50 p-6">
            <h3 className="text-white mb-4">Booking Summary</h3>
            <div className="space-y-2 text-muted-foreground mb-6">
              <p>Date: <span className="text-white">{date.toLocaleDateString()}</span></p>
              <p>Time: <span className="text-white">{selectedTime}</span></p>
              <p>Duration: <span className="text-white">60 minutes</span></p>
            </div>
            <Button
              onClick={handleBooking}
              className="w-full bg-primary hover:bg-primary/90 text-black"
            >
              Confirm Booking
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
