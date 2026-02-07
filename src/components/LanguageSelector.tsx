import { useState, useEffect } from 'react';
import { useI18n, type Language } from '../context/I18nContext';
import { Globe, Check, X } from 'lucide-react';

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
          <div className="bg-zinc-800 rounded-lg p-4 space-y-2">
            <div>
              <p className="text-sm text-zinc-400">Email</p>
              <p className="text-white font-medium">{t('support', 'supportEmail')}</p>
            </div>
            <div>
              <p className="text-sm text-zinc-400">Phone</p>
              <p className="text-white font-medium">{t('support', 'supportPhone')}</p>
            </div>
          </div>

          <div className="bg-zinc-800 rounded-lg p-4 space-y-2">
            <p className="text-sm text-zinc-400">{t('support', 'responseTime')}</p>
            <a
              href="mailto:support@gym-crm.com"
              className="text-white hover:text-primary transition-colors block"
            >
              {t('support', 'contactUs')}
            </a>
            <a
              href="https://t.me/test_support_link"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-primary transition-colors block"
            >
              {t('support', 'testSupportLink')}
            </a>
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

export function LanguageSelector({
  compact = false,
  align,
}: {
  compact?: boolean;
  align?: 'left' | 'right';
}) {
  const { language, setLanguage, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const menuAlign = align || (compact ? 'left' : 'right');

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
          className={`flex items-center gap-2 rounded-lg border border-border bg-card/90 text-white shadow-sm hover:bg-card transition-colors ${
            compact ? 'px-2.5 py-2' : 'px-3 py-2'
          }`}
          aria-label={t('common', 'language')}
        >
          <Globe className="w-4 h-4" />
          {!compact && (
            <>
              <span className="text-sm">{t('common', 'language')}</span>
              <span className="text-xs text-muted-foreground uppercase">{language}</span>
            </>
          )}
          {compact && <span className="text-[10px] uppercase text-muted-foreground">{language}</span>}
        </button>

        {isOpen && (
          <div
            className={`absolute top-full mt-2 bg-card rounded-lg shadow-2xl border border-border z-50 overflow-hidden ${
              menuAlign === 'right' ? 'right-0' : 'left-0'
            } w-[220px] max-w-[260px]`}
          >
            <div className="py-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className="w-full flex items-center justify-between px-4 py-2 hover:bg-muted text-white transition-colors text-left"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-lg">{lang.flag}</span>
                    <span className="truncate">{lang.name}</span>
                  </div>
                  {language === lang.code && <Check className="w-4 h-4 text-primary" />}
                </button>
              ))}
            </div>
            <div className="border-t border-border pt-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowSupport(true);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-muted text-muted-foreground hover:text-white transition-colors"
              >
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
