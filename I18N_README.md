# Multi-Language Support

## Supported Languages

- **English** (en) - Default language
- **Русский** (ru) - Russian language
- **Беларуская** (be) - Belarusian language

## Usage

### Adding Translations

Translation files are located in `src/i18n/`:
- `en.json` - English translations
- `ru.json` - Russian translations
- `be.json` - Belarusian translations

### Translation Structure

Each language file follows this structure:

```json
{
  "section": {
    "key": "Translation text"
  }
}
```

### Using Translations in Components

```tsx
import { useI18n } from '../context/I18nContext';

function MyComponent() {
  const { t } = useI18n();
  
  return <div>{t('auth', 'login')}</div>;
}
```

### Switching Languages

Users can switch languages using the language selector in the top-right corner of the auth pages.

Language preference is automatically saved to localStorage.

## Technical Support Link

The test support link is configured in `src/components/LanguageSelector.tsx`:

```tsx
<a
  href="https://t.me/test_support_link"
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-2"
>
  <Globe className="w-4 h-4" />
  {t('support', 'testSupportLink')}
</a>
```

To change the support link, update the `href` attribute in the SupportModal component.

## Available Translations

### Common
- login, register, email, password, phone, fullName
- submit, cancel, save, delete, edit
- loading, error, success, language, support

### Auth
- welcomeBack, startTransformation, dontHaveAccount, registerHere
- alreadyHaveAccount, loginHere, signIn, signUp
- creatingAccount, emailPlaceholder, passwordPlaceholder
- phonePlaceholder, namePlaceholder, phoneOptional
- invalidEmailOrPassword, emailAlreadyRegistered
- registrationFailed, loginFailed
- passwordRequired, newPasswordRequired
- passwordMinLength

### Layout
- dashboard, members, bookings, analytics, settings
- logout, welcome, admin, client

### Support
- title, description, contactUs, testSupportLink
- responseTime, supportEmail, supportPhone
