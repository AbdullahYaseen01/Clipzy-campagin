const PROVIDERS = [
  {
    id: 'gmail',
    name: 'Gmail',
    icon: '📧',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    imapHost: 'imap.gmail.com',
    imapPort: 993,
    sentFolder: '[Gmail]/Sent',
    hint: 'Use a Google App Password (not your regular password).',
  },
  {
    id: 'outlook',
    name: 'Outlook / Hotmail',
    icon: '📨',
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
    imapHost: 'outlook.office365.com',
    imapPort: 993,
    sentFolder: 'Sent Items',
    hint: 'Works with Outlook.com, Hotmail, and Microsoft 365.',
  },
  {
    id: 'yahoo',
    name: 'Yahoo Mail',
    icon: '💜',
    host: 'smtp.mail.yahoo.com',
    port: 587,
    secure: false,
    imapHost: 'imap.mail.yahoo.com',
    imapPort: 993,
    sentFolder: 'Sent',
    hint: 'Generate an app password in Yahoo account security settings.',
  },
  {
    id: 'zoho',
    name: 'Zoho Mail',
    icon: '🟡',
    host: 'smtp.zoho.com',
    port: 587,
    secure: false,
    imapHost: 'imap.zoho.com',
    imapPort: 993,
    sentFolder: 'Sent',
    hint: 'Use your Zoho email and app-specific password.',
  },
  {
    id: 'hostinger',
    name: 'Hostinger Email',
    icon: '🌐',
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    imapHost: 'imap.hostinger.com',
    imapPort: 993,
    sentFolder: 'INBOX.Sent',
    hint: 'Use your full Hostinger email address and mailbox password. Sent copies are saved to webmail automatically.',
  },
  {
    id: 'custom',
    name: 'Custom SMTP',
    icon: '⚙️',
    host: '',
    port: 587,
    secure: false,
    imapHost: '',
    imapPort: 993,
    sentFolder: 'Sent',
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
