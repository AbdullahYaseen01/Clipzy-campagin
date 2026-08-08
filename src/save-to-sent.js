/**
 * After SMTP send, APPEND a copy into the mailbox Sent folder via IMAP
 * so Hostinger (and similar) webmail shows tool-sent messages.
 */

const { ImapFlow } = require('imapflow');
const MailComposer = require('nodemailer/lib/mail-composer');

const SENT_CANDIDATES = [
  'INBOX.Sent',
  'Sent',
  'INBOX/Sent',
  'Sent Items',
  'Sent Messages',
  '[Gmail]/Sent',
];

function imapConfigForAccount(acc) {
  if (!acc?.email || !acc?.pass) return null;

  const hostinger = acc.provider === 'hostinger'
    || acc.host === 'smtp.hostinger.com'
    || String(acc.host || '').includes('hostinger')
    || String(acc.imapHost || '').includes('hostinger');

  const gmail = acc.host === 'smtp.gmail.com'
    || String(acc.email).toLowerCase().endsWith('@gmail.com');

  let imapHost = acc.imapHost;
  let imapPort = parseInt(acc.imapPort, 10) || 0;
  let sentFolder = acc.sentFolder || '';

  if (!imapHost && hostinger) {
    imapHost = 'imap.hostinger.com';
    imapPort = imapPort || 993;
    sentFolder = sentFolder || 'INBOX.Sent';
  } else if (!imapHost && gmail) {
    imapHost = 'imap.gmail.com';
    imapPort = imapPort || 993;
    sentFolder = sentFolder || '[Gmail]/Sent';
  } else if (!imapHost) {
    // Guess imap. from smtp. host (smtp.example.com → imap.example.com)
    const smtp = String(acc.host || '');
    if (smtp.startsWith('smtp.')) imapHost = `imap.${smtp.slice(5)}`;
    else if (smtp.startsWith('smtp-')) imapHost = smtp.replace(/^smtp-/, 'imap-');
  }

  if (!imapHost) return null;

  return {
    host: imapHost,
    port: imapPort || 993,
    secure: true,
    auth: {
      user: acc.email,
      pass: acc.pass,
    },
    sentFolder: sentFolder || null,
    logger: false,
  };
}

async function buildRawMessage(mailOptions) {
  const compiler = new MailComposer({
    ...mailOptions,
    date: mailOptions.date || new Date(),
  });
  return compiler.compile().build();
}

async function resolveSentPath(client, preferred) {
  const list = await client.list();
  const lower = new Map(list.map((b) => [String(b.path).toLowerCase(), b.path]));

  const candidates = [
    preferred,
    ...SENT_CANDIDATES,
    ...list.filter((b) => b.specialUse === '\\Sent').map((b) => b.path),
    ...list.filter((b) => /sent/i.test(b.path) || /sent/i.test(b.name || '')).map((b) => b.path),
  ].filter(Boolean);

  for (const name of candidates) {
    const hit = lower.get(String(name).toLowerCase());
    if (hit) return hit;
  }
  return preferred || 'INBOX.Sent';
}

/**
 * Save an already-composed outbound message into Sent. Never throws to caller path —
 * logs and returns false on failure so SMTP success is not rolled back.
 */
async function saveCopyToSent(account, mailOptions, { timeoutMs = 20000 } = {}) {
  const cfg = imapConfigForAccount(account);
  if (!cfg) return { ok: false, skipped: true, reason: 'no_imap' };

  const raw = await buildRawMessage(mailOptions);

  const run = async () => {
    const client = new ImapFlow({
      host: cfg.host,
      port: cfg.port,
      secure: cfg.secure,
      auth: cfg.auth,
      logger: false,
      emitLogs: false,
    });

    try {
      await client.connect();
      const path = await resolveSentPath(client, cfg.sentFolder);
      const result = await client.append(path, raw, ['\\Seen']);
      return { ok: true, path, uid: result?.uid };
    } finally {
      try { await client.logout(); } catch (_) { /* ignore */ }
    }
  };

  try {
    const result = await Promise.race([
      run(),
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`IMAP Sent save timed out after ${timeoutMs / 1000}s`)), timeoutMs);
      }),
    ]);
    return result;
  } catch (err) {
    console.warn(`[sent-folder] ${account.email || account.id}: ${err.message}`);
    return { ok: false, error: err.message };
  }
}

module.exports = {
  imapConfigForAccount,
  saveCopyToSent,
  buildRawMessage,
};
