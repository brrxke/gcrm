import { useState, useEffect } from 'react';
import { useI18n } from '../context/I18nContext';
import { Globe, Check, X, MessageCircle, Mail, Phone } from 'lucide-react';

export function SupportModal({ onClose }: { onClose: () => void }) {
  const { t } = useI18n();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">{t('support', 'title')}</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-zinc-300 mb-6">{t('support', 'description')}</p>

        <div className="space-y-4">
          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <Mail className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-zinc-400">Email</p>
                <p className="text-white font-medium">{t('support', 'supportEmail')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-zinc-400">Phone</p>
                <p className="text-white font-medium">{t('support', 'supportPhone')}</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-800 rounded-lg p-4">
            <p className="text-sm text-zinc-400 mb-2">{t('support', 'responseTime')}</p>
            <div className="space-y-2">
              <a
                href="mailto:support@gym-crm.com"
                className="flex items-center gap-2 text-white hover:text-primary transition-colors w-full"
              >
                <MessageCircle className="w-4 h-4" />
                {t('support', 'contactUs')}
              </a>
              <a
                href="https://t.me/test_support_link"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white hover:text-primary transition-colors w-full"
              >
                <Globe className="w-4 h-4" />
                {t('support', 'testSupportLink')}
              </a>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-zinc-800 hover:bg-zinc-700 text-white py-2 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export function LanguageSelector() {
  const { language, setLanguage, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  const languages = [
    { code: 'en' as const, name: 'English', flag: '🇬🇧' },
    { code: 'ru' as const, name: 'Русский', flag: '🇷🇺' },
    { code: 'be' as const, name: 'Беларуская', flag: '🇧🇾' },
  ];

  const handleLanguageChange = (lang: Language) => {
    console.log('Changing language to:', lang);
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white transition-colors"
        >
          <Globe className="w-4 h-4" />
          <span className="text-sm">{t('common', 'language')}</span>
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 bg-zinc-900 rounded-lg shadow-xl border border-zinc-800 min-w-[200] z-50">
            <div className="py-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className="w-full flex items-center justify-between px-4 py-2 hover:bg-zinc-800 text-white transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </div>
                  {language === lang.code && <Check className="w-4 h-4 text-primary" />}
                </button>
              ))}
            </div>
            <div className="border-t border-zinc-800 pt-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowSupport(true);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">{t('common', 'support')}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {showSupport && <SupportModal onClose={() => setShowSupport(false)} />}
    </>
  );
}
