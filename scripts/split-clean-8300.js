/**
 * Clean 8,300-Data.csv → real emails only, format for Reachly import,
 * split into chunks of 700.
 *
 * Output: cleaned_splits/contacts_part_XX.csv (first_name,name,email)
 */
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { parseContactsCsv } = require('../src/import-contacts');

const ROOT = path.join(__dirname, '..');
const INPUT = path.join(ROOT, '8,300-Data.csv');
const OUT_DIR = path.join(ROOT, 'cleaned_splits');
const CHUNK = 700;

const FAKE_DOMAINS = new Set([
  'example.com', 'example.org', 'example.net', 'test.com', 'test.org',
  'mailinator.com', 'guerrillamail.com', 'tempmail.com', 'temp-mail.org',
  '10minutemail.com', 'yopmail.com', 'trashmail.com', 'fakeinbox.com',
  'sharklasers.com', 'discard.email', 'mailnesia.com', 'getnada.com',
  'localhost', 'localdomain', 'email.com', 'domain.com', 'sample.com',
  'xxx.com', 'asdf.com', 'qwerty.com', 'abc.com', 'xyz.com',
]);

const FAKE_LOCAL = /^(test|testing|fake|asdf|qwert|sample|demo|noreply|no-reply|donotreply|null|undefined|admin@|user\d*)$/i;

function csvEscape(value) {
  const s = String(value ?? '');
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function isRealEmail(email) {
  if (!email || email.length > 254) return false;
  if (!/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i.test(email)) {
    return false;
  }
  const [local, domain] = email.toLowerCase().split('@');
  if (!local || !domain) return false;
  if (FAKE_LOCAL.test(local)) return false;
  if (FAKE_DOMAINS.has(domain)) return false;
  if (domain.endsWith('.test') || domain.endsWith('.invalid') || domain.endsWith('.localhost')) return false;
  // need a real TLD (2+ chars) and at least one dot
  if (!domain.includes('.')) return false;
  const tld = domain.split('.').pop();
  if (!tld || tld.length < 2) return false;
  // reject obvious garbage locals
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
  if (FAKE_LOCAL.test(part)) return '';
  return titleCase(part);
}

function main() {
  if (!fs.existsSync(INPUT)) {
    console.error('Missing input:', INPUT);
    process.exit(1);
  }

  const raw = fs.readFileSync(INPUT, 'utf8');
  // Prefer project importer (same rules as upload)
  let contacts = parseContactsCsv(raw);

  // Extra pass: drop fakes / normalize names
  const seen = new Set();
  const cleaned = [];
  let droppedFake = 0;
  let droppedDup = 0;

  for (const c of contacts) {
    const email = (c.email || '').toLowerCase().trim();
    if (!isRealEmail(email)) {
      droppedFake++;
      continue;
    }
    if (seen.has(email)) {
      droppedDup++;
      continue;
    }
    seen.add(email);

    let first = (c.first_name || '').trim();
    if (!first || first.length < 2 || /^(there|test|admin|info)$/i.test(first)) {
      first = firstFromEmail(email) || 'there';
    } else {
      first = titleCase(first.replace(/[^a-zA-Z'-]/g, '') || first);
    }

    const name = (c.name || first).trim() || first;
    cleaned.push({ first_name: first, name, email });
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  // clear old parts
  for (const f of fs.readdirSync(OUT_DIR)) {
    if (/^contacts_part_\d+\.csv$/i.test(f)) fs.unlinkSync(path.join(OUT_DIR, f));
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

  // also one full clean file for convenience
  const allPath = path.join(OUT_DIR, 'contacts_all_clean.csv');
  const allLines = ['first_name,name,email'];
  for (const row of cleaned) {
    allLines.push([row.first_name, row.name, row.email].map(csvEscape).join(','));
  }
  fs.writeFileSync(allPath, `${allLines.join('\n')}\n`, 'utf8');

  console.log('---');
  console.log(`Input rows parsed: ${contacts.length}`);
  console.log(`Dropped fake/invalid: ${droppedFake}`);
  console.log(`Dropped duplicates: ${droppedDup}`);
  console.log(`Clean real emails: ${cleaned.length}`);
  console.log(`Parts of ${CHUNK}: ${parts}`);
  console.log(`Output folder: ${OUT_DIR}`);
}

main();
