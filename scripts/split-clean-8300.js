/**
 * Clean 8,300-Data.csv → only real, reply-able personal emails.
 * Format for Reachly: first_name,name,email — split into chunks of 700.
 *
 * Output: cleaned_splits/contacts_part_XX.csv + contacts_all_clean.csv
 */
const fs = require('fs');
const path = require('path');
const { parseContactsCsv } = require('../src/import-contacts');

const ROOT = path.join(__dirname, '..');
const INPUT = path.join(ROOT, '8,300-Data.csv');
const OUT_DIR = path.join(ROOT, 'cleaned_splits');
const CHUNK = 700;

const FAKE_DOMAINS = new Set([
  'example.com', 'example.org', 'example.net', 'test.com', 'test.org', 'test.net',
  'mailinator.com', 'guerrillamail.com', 'tempmail.com', 'temp-mail.org', 'tempmail.net',
  '10minutemail.com', 'yopmail.com', 'trashmail.com', 'fakeinbox.com', 'trashmail.net',
  'sharklasers.com', 'discard.email', 'mailnesia.com', 'getnada.com', 'moakt.com',
  'guerrillamail.info', 'grr.la', 'spam4.me', 'mailcatch.com', 'maildrop.cc',
  'localhost', 'localdomain', 'email.com', 'domain.com', 'sample.com', 'mail.com',
  'xxx.com', 'asdf.com', 'qwerty.com', 'abc.com', 'xyz.com', '123.com',
  'tempurl.com', 'dispostable.com', 'mailnull.com', 'spamgourmet.com',
  'throwawaymail.com', 'fakemailgenerator.com', 'emailondeck.com',
]);

/** Generic / no-reply inboxes — low chance of a real creator response */
const ROLE_LOCAL = /^(info|contact|admin|sales|hello|support|office|team|mail|hi|help|service|social|noreply|no-?reply|donotreply|do-?not-?reply|marketing|press|media|jobs|careers|hr|billing|accounts|webmaster|postmaster|abuse|privacy|legal|enquir(?:y|ies|e)|inquiry|general|reception|desk|inbox|news|newsletter|subscribe|updates?|notify|notifications?|bounce|daemon|root|user|test|testing|demo|sample|asdf|qwerty|xxx|null|undefined|me|you|name|email|firstname|lastname|customerservice|customercare|feedback|partners?|business|bd|biz|ops|operations|finance|accounting|recruiting|talent|apply|applications|hellohello|hey|whatsup|spam|fake)$/i;

const FAKE_LOCAL = /^(test|testing|fake|asdf|qwert|sample|demo|noreply|no-reply|donotreply|null|undefined|user\d*|admin\d*|abc\d*|xxx+)$/i;

function csvEscape(value) {
  const s = String(value ?? '');
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function looksRandomLocal(local) {
  if (/^[0-9a-f]{8}-[0-9a-f-]{20,}$/i.test(local)) return true;
  // phone-like locals
  if (/^\d{8,}$/.test(local)) return true;
  if (/^n?\d{10,}$/i.test(local)) return true;
  // long string with almost no vowels
  const letters = local.replace(/[^a-z]/gi, '');
  if (letters.length >= 10 && (letters.match(/[aeiou]/gi) || []).length < 2) return true;
  if (/^(abc|abcd|abcdef|qwerty|asdfgh|zxcvbn)/i.test(local)) return true;
  return false;
}

function isRealReplyableEmail(email) {
  if (!email || email.length > 254) return false;
  if (!/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i.test(email)) {
    return false;
  }
  const [local, domain] = email.toLowerCase().split('@');
  if (!local || !domain) return false;

  if (ROLE_LOCAL.test(local)) return false;
  if (FAKE_LOCAL.test(local)) return false;
  if (looksRandomLocal(local)) return false;
  if (/noreply|no-reply|donotreply|do-not-reply|bounce|mailer-daemon/i.test(email)) return false;

  if (FAKE_DOMAINS.has(domain)) return false;
  if (domain.endsWith('.test') || domain.endsWith('.invalid') || domain.endsWith('.localhost')) return false;
  if (domain.includes('tempmail') || domain.includes('mailinator') || domain.includes('guerrillamail')) return false;

  if (!domain.includes('.')) return false;
  const tld = domain.split('.').pop();
  if (!tld || tld.length < 2) return false;

  if (/^(.)\1{4,}$/.test(local)) return false;
  if (/^\d+$/.test(local)) return false;

  return true;
}

function titleCase(word) {
  if (!word) return '';
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function firstFromEmail(email) {
  const local = email.split('@')[0] || '';
  const part = local.split(/[._+-]/)[0];
  if (!part || part.length < 2 || part.length > 20) return '';
  if (!/^[a-zA-Z][a-zA-Z'-]*$/.test(part)) return '';
  if (ROLE_LOCAL.test(part) || FAKE_LOCAL.test(part)) return '';
  return titleCase(part);
}

function main() {
  if (!fs.existsSync(INPUT)) {
    console.error('Missing input:', INPUT);
    process.exit(1);
  }

  const raw = fs.readFileSync(INPUT, 'utf8');
  const contacts = parseContactsCsv(raw);

  const seen = new Set();
  const cleaned = [];
  let droppedFake = 0;
  let droppedDup = 0;
  const dropSamples = [];

  for (const c of contacts) {
    const email = (c.email || '').toLowerCase().trim();
    if (!isRealReplyableEmail(email)) {
      droppedFake++;
      if (dropSamples.length < 40) dropSamples.push(email);
      continue;
    }
    if (seen.has(email)) {
      droppedDup++;
      continue;
    }
    seen.add(email);

    let first = (c.first_name || '').trim();
    if (!first || first.length < 2 || /^(there|test|admin|info|contact|hello)$/i.test(first)) {
      first = firstFromEmail(email) || 'there';
    } else {
      const cleanedFirst = first.replace(/[^a-zA-Z'-]/g, '');
      first = titleCase(cleanedFirst || first);
    }

    const name = (c.name || first).trim() || first;
    cleaned.push({ first_name: first, name, email });
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const f of fs.readdirSync(OUT_DIR)) {
    if (/^contacts_part_\d+\.csv$/i.test(f) || f === 'contacts_all_clean.csv') {
      fs.unlinkSync(path.join(OUT_DIR, f));
    }
  }

  const parts = Math.ceil(cleaned.length / CHUNK) || 0;
  for (let i = 0; i < parts; i++) {
    const slice = cleaned.slice(i * CHUNK, (i + 1) * CHUNK);
    const lines = ['first_name,name,email'];
    for (const row of slice) {
      lines.push([row.first_name, row.name, row.email].map(csvEscape).join(','));
    }
    const file = path.join(OUT_DIR, `contacts_part_${String(i + 1).padStart(2, '0')}.csv`);
    fs.writeFileSync(file, `${lines.join('\n')}\n`, 'utf8');
    console.log(`Wrote ${path.basename(file)} — ${slice.length} contacts`);
  }

  const allPath = path.join(OUT_DIR, 'contacts_all_clean.csv');
  const allLines = ['first_name,name,email'];
  for (const row of cleaned) {
    allLines.push([row.first_name, row.name, row.email].map(csvEscape).join(','));
  }
  fs.writeFileSync(allPath, `${allLines.join('\n')}\n`, 'utf8');

  console.log('---');
  console.log(`Input rows parsed: ${contacts.length}`);
  console.log(`Dropped fake/role/noreply: ${droppedFake}`);
  console.log(`Dropped duplicates: ${droppedDup}`);
  console.log(`Clean real emails: ${cleaned.length}`);
  console.log(`Parts of ${CHUNK}: ${parts}`);
  if (dropSamples.length) {
    console.log('Sample dropped:', dropSamples.slice(0, 15).join(', '));
  }
  console.log(`Output folder: ${OUT_DIR}`);
}

main();
