const HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SECURE = process.env.SMTP_SECURE === 'true';
// Personal Gmail: keep per-inbox volume modest so 10 accounts can share ~1500–2000/day
const DEFAULT_DAILY = parseInt(process.env.DAILY_LIMIT || '200', 10);
const DEFAULT_DELAY = parseInt(process.env.SEND_DELAY_MS || '8000', 10);
const MAX_ACCOUNTS = 10;

function buildAccount({
  id,
  listId,
  label,
  listLabel,
  email,
  pass,
  fromName,
  dailyLimit,
  sendDelayMs,
  protected: isProtected,
  host,
  port,
  secure,
}) {
  if (!email || !pass) return null;
  return {
    id,
    listId,
    label,
    listLabel,
    host: host || HOST,
    port: port != null ? port : PORT,
    secure: secure != null ? secure : SECURE,
    email: email.trim(),
    pass: pass.replace(/\s/g, ''),
    from: email.trim(),
    fromName: fromName || 'The Clipzy Team',
    dailyLimit,
    sendDelayMs,
    protected: !!isProtected,
  };
}

function envFlag(name) {
  const v = process.env[name];
  if (v == null) return undefined;
  return v !== 'false' && v !== '0';
}

function loadAccounts() {
  const accounts = [];

  for (let i = 1; i <= MAX_ACCOUNTS; i++) {
    const user = process.env[`SMTP_ACCOUNT_${i}_USER`]
      || (i === 1 ? process.env.SMTP_USER : null);
    const pass = process.env[`SMTP_ACCOUNT_${i}_PASS`]
      || (i === 1 ? process.env.SMTP_PASS : null);

    const account = buildAccount({
      id: `account${i}`,
      listId: `list${i}`,
      label: process.env[`SMTP_ACCOUNT_${i}_LABEL`] || `Gmail ${i}`,
      listLabel: `Data List ${i}`,
      email: user,
      pass,
      fromName: process.env[`SMTP_ACCOUNT_${i}_FROM_NAME`]
        || process.env.SMTP_FROM_NAME
        || 'The Clipzy Team',
      // Always Gmail SMTP unless explicitly overridden per account
      host: process.env[`SMTP_ACCOUNT_${i}_HOST`] || process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env[`SMTP_ACCOUNT_${i}_PORT`]
        ? parseInt(process.env[`SMTP_ACCOUNT_${i}_PORT`], 10)
        : undefined,
      secure: envFlag(`SMTP_ACCOUNT_${i}_SECURE`) != null
        ? envFlag(`SMTP_ACCOUNT_${i}_SECURE`)
        : undefined,
      dailyLimit: parseInt(
        process.env[`SMTP_ACCOUNT_${i}_DAILY_LIMIT`] || String(DEFAULT_DAILY),
        10
      ),
      sendDelayMs: parseInt(
        process.env[`SMTP_ACCOUNT_${i}_DELAY_MS`] || String(DEFAULT_DELAY),
        10
      ),
      protected: false,
    });
    if (account) accounts.push(account);
  }

  return accounts;
}

let cachedAccounts = null;

function getAccounts() {
  if (!cachedAccounts) cachedAccounts = loadAccounts();
  return cachedAccounts;
}

function getAccount(id) {
  return getAccounts().find(a => a.id === id) || null;
}

function getAccountByList(listId) {
  return getAccounts().find(a => a.listId === listId) || null;
}

function getDefaultAccount() {
  return getAccounts()[0] || null;
}

function resetAccountsCache() {
  cachedAccounts = null;
}

module.exports = {
  getAccounts,
  getAccount,
  getAccountByList,
  getDefaultAccount,
  resetAccountsCache,
  MAX_ACCOUNTS,
};
