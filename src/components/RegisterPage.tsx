import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dumbbell, Mail, Lock, Loader2, Phone, User } from 'lucide-react';
import { useI18n } from '../context/I18nContext';
import { LanguageSelector } from './LanguageSelector';

interface RegisterPageProps {
  onRegister: (email: string, password: string, name: string, phone?: string) => Promise<void>;
}

export function RegisterPage({ onRegister }: RegisterPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useI18n();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await onRegister(name, email, password, phone);
    } catch (err: any) {
      setError(err.message || t('auth', 'registrationFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="absolute top-4 right-4">
          <LanguageSelector />
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-lg mb-4">
            <Dumbbell className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl mb-2 text-white uppercase tracking-wider">APEX GYM</h1>
          <p className="text-muted-foreground">{t('auth', 'startTransformation')}</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-md">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">{t('common', 'fullName')}</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder={t('auth', 'namePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 bg-input border-border text-white placeholder:text-muted-foreground"
                required
                disabled={isLoading}
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
                placeholder={t('auth', 'emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-input border-border text-white placeholder:text-muted-foreground"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white">{t('common', 'phone')} ({t('auth', 'phoneOptional')})</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder={t('auth', 'phonePlaceholder')}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-10 bg-input border-border text-white placeholder:text-muted-foreground"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">{t('common', 'password')}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder={t('auth', 'passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-input border-border text-white placeholder:text-muted-foreground"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-black"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('auth', 'creatingAccount')}
              </>
            ) : (
              t('auth', 'signUp')
            )}
          </Button>

          <div className="text-center pt-4">
            <a
              href="/login"
              className="text-sm text-primary hover:underline transition-colors"
            >
              {t('auth', 'alreadyHaveAccount')} {t('auth', 'loginHere')}
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
