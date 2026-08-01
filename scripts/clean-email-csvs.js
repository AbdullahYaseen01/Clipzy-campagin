const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

function csvEscape(value) {
  const s = String(value ?? '');
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function toCsv(rows, columns) {
  const lines = [columns.join(',')];
  for (const row of rows) {
    lines.push(columns.map((col) => csvEscape(row[col])).join(','));
  }
  return `${lines.join('\n')}\n`;
}

const ROOT = path.join(__dirname, '..');
const FILES = ['clean_emails_1.csv', 'clean_emails_2.csv', 'clean_emails_3.csv'];

const SKIP = new Set([
  'the', 'a', 'an', 'and', 'or', 'of', 'in', 'on', 'to', 'for', 'with', 'by', 'at', 'from',
  'living', 'live', 'life', 'love', 'moving', 'move', 'discover', 'explore', 'talk', 'selling', 'sale', 'services',
  'realtor', 'realtors', 'realty', 'real', 'estate', 'homes', 'home', 'house', 'housing', 'househunting', 'hunting',
  'group', 'team', 'network', 'agency', 'agent', 'broker', 'brokerage', 'associates', 'properties', 'property',
  'new', 'your', 'our', 'best', 'top', 'prime', 'coastal', 'luxury', 'lifestyle', 'southern', 'comfort', 'doctor', 'roof',
  'south', 'north', 'east', 'west', 'central', 'eastern', 'southwest', 'florida', 'louisiana', 'pennsylvania',
  'baton', 'rouge', 'orleans', 'calgary',
  'bc', 'la', 'nola', 'dfw', 'pa', 'swfl', 'llc', 'inc', 'ltd', 'co', 'com', 'www', 'youtube', 'channel',
]);

const ROLE_LOCAL = /^(info|contact|admin|sales|hello|support|office|team|mail|hi|help|service|social|noreply|no-reply)$/i;

const KNOWN_FIX_TLD = {
  'gmail.co': 'gmail.com',
  'yahoo.co': 'yahoo.com',
  'hotmail.co': 'hotmail.com',
  'outlook.co': 'outlook.com',
  'icloud.co': 'icloud.com',
  'aol.co': 'aol.com',
  'keyes.co': 'keyes.com',
};

function titleCase(word) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function firstFromEmail(email) {
  const local = String(email || '').split('@')[0] || '';
  if (!local || ROLE_LOCAL.test(local)) return '';
  const part = local.split(/[._+-]/)[0];
  if (!part || part.length < 2 || part.length > 12) return '';
  if (ROLE_LOCAL.test(part) || /^\d+$/.test(part)) return '';
  if (!/^[a-zA-Z][a-zA-Z'-]*$/.test(part)) return '';
  return titleCase(part);
}

function extractFirstName(name, email) {
  const fromEmail = firstFromEmail(email);
  const local = String(email || '').split('@')[0] || '';
  const nameLower = String(name || '').toLowerCase();

  // first.last@... is usually the real person name
  if (fromEmail && /[._]/.test(local)) return fromEmail;
  // email local matches a word in the channel/name
  if (fromEmail && nameLower.includes(fromEmail.toLowerCase())) return fromEmail;

  const tokens = String(name || '')
    .replace(/[|–—:/®™()[\]{}"'*]+/g, ' ')
    .split(/\s+/)
    .map((t) => t.replace(/[^a-zA-Z'-]/g, ''))
    .filter((t) => t.length >= 2);

  for (const t of tokens) {
    if (SKIP.has(t.toLowerCase())) continue;
    if (/^[A-Z]{3,}$/.test(t)) continue; // skip ALL CAPS channel words
    return titleCase(t);
  }
  return fromEmail || 'there';
}

function normalizeEmail(raw) {
  let email = String(raw || '').trim().replace(/\s+/g, '').toLowerCase();
  if (!email) return '';
  email = email.replace(/^mailto:/i, '');

  for (const [bad, good] of Object.entries(KNOWN_FIX_TLD)) {
    if (email.endsWith('@' + bad)) {
      email = email.slice(0, -bad.length) + good;
    }
  }

  // scrape artifacts: ninfo@... or nfirst.last@...
  const roleN = email.match(/^n([a-z0-9._%+-]+)@(.+)$/i);
  if (roleN && ROLE_LOCAL.test(roleN[1])) {
    email = `${roleN[1].toLowerCase()}@${roleN[2].toLowerCase()}`;
  }
  const dottedN = email.match(/^n([a-z][a-z0-9_-]*\.[a-z0-9._%+-]+@[a-z0-9.-]+)$/i);
  if (dottedN) {
    email = dottedN[1].toLowerCase();
  }

  return email;
}

function isValidEmail(email) {
  if (!email || email.length > 254) return false;
  if (!/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/.test(email)) {
    return false;
  }
  const [local, domain] = email.split('@');
  if (!local || !domain) return false;
  if (local.startsWith('.') || local.endsWith('.') || local.includes('..')) return false;
  if (!domain.includes('.')) return false;
  const tld = domain.split('.').pop();
  return Boolean(tld && tld.length >= 2);
}

function cleanFile(fileName) {
  const file = path.join(ROOT, fileName);
  const rows = parse(fs.readFileSync(file, 'utf8'), {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
    relax_quotes: true,
    bom: true,
  });

  const normalized = [];
  for (const r of rows) {
    const name = String(r.name || r.Name || '').trim().replace(/\s+/g, ' ');
    const email = normalizeEmail(r.email || r.Email || r['email address'] || '');
    if (!email || !isValidEmail(email)) continue;
    normalized.push({ name, email });
  }

  const emailSet = new Set(normalized.map((r) => r.email));
  const withoutTwinJunk = normalized.filter((r) => {
    if (r.email.startsWith('n') && emailSet.has(r.email.slice(1))) return false;
    return true;
  });

  const seen = new Set();
  const out = [];
  let droppedDupe = 0;
  for (const r of withoutTwinJunk) {
    if (seen.has(r.email)) {
      droppedDupe += 1;
      continue;
    }
    seen.add(r.email);
    const first_name = extractFirstName(r.name, r.email);
    out.push({
      first_name,
      name: r.name || first_name,
      email: r.email,
    });
  }

  fs.writeFileSync(file, toCsv(out, ['first_name', 'name', 'email']), 'utf8');

  return {
    file: fileName,
    input: rows.length,
    output: out.length,
    droppedInvalid: rows.length - normalized.length,
    droppedTwin: normalized.length - withoutTwinJunk.length,
    droppedDupe,
  };
}

const stats = FILES.map(cleanFile);
console.log(JSON.stringify(stats, null, 2));
console.log('TOTAL kept', stats.reduce((a, s) => a + s.output, 0));
console.log('TOTAL dropped', stats.reduce((a, s) => a + s.droppedInvalid + s.droppedTwin + s.droppedDupe, 0));
