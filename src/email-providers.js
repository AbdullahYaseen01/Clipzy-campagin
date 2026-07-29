const PROVIDERS = [
  {
    id: 'gmail',
    name: 'Gmail',
    icon: '📧',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    hint: 'Use a Google App Password (not your regular password).',
  },
  {
    id: 'outlook',
    name: 'Outlook / Hotmail',
    icon: '📨',
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
    hint: 'Works with Outlook.com, Hotmail, and Microsoft 365.',
  },
  {
    id: 'yahoo',
    name: 'Yahoo Mail',
    icon: '💜',
    host: 'smtp.mail.yahoo.com',
    port: 587,
    secure: false,
    hint: 'Generate an app password in Yahoo account security settings.',
  },
  {
    id: 'zoho',
    name: 'Zoho Mail',
    icon: '🟡',
    host: 'smtp.zoho.com',
    port: 587,
    secure: false,
    hint: 'Use your Zoho email and app-specific password.',
  },
  {
    id: 'hostinger',
    name: 'Hostinger Email',
    icon: '🌐',
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    hint: 'Use your full Hostinger email address and mailbox password.',
  },
  {
    id: 'custom',
    name: 'Custom SMTP',
    icon: '⚙️',
    host: '',
    port: 587,
    secure: false,
    hint: 'Any SMTP server — enter host, port, and credentials manually.',
  },
];

function getProviders() {
  return PROVIDERS;
}

function getProvider(id) {
  return PROVIDERS.find(p => p.id === id) || PROVIDERS.find(p => p.id === 'custom');
}

module.exports = { getProviders, getProvider, PROVIDERS };
