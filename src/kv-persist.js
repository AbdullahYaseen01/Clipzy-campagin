/**
 * Durable store for Vercel via Upstash Redis REST (not Blob — avoids Blob op limits).
 * Free Upstash DB: https://console.upstash.com
 *
 * Env:
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
 */

const STORE_KEY = process.env.REACHLY_STORE_KEY || 'reachly:store';

function hasKv() {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

async function redisCommand(command) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Upstash ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json();
}

async function downloadStore() {
  if (!hasKv()) return null;
  try {
    const data = await redisCommand(['GET', STORE_KEY]);
    if (data.result == null || data.result === '') return null;
    const raw = typeof data.result === 'string' ? data.result : JSON.stringify(data.result);
    return JSON.parse(raw);
  } catch (err) {
    console.warn('[kv] download failed:', err.message);
    return null;
  }
}

async function uploadStore(storeData) {
  if (!hasKv()) return false;
  try {
    const payload = JSON.stringify(storeData);
    // Keep last 7 days of campaign data durable; Upstash free tier is plenty for this size
    await redisCommand(['SET', STORE_KEY, payload]);
    return true;
  } catch (err) {
    console.error('[kv] upload failed:', err.message);
    return false;
  }
}

function getPersistMode(isServerless) {
  if (hasKv()) {
    return { mode: 'upstash', durable: true, label: 'Upstash Redis (durable)' };
  }
  if (isServerless) {
    return {
      mode: 'ephemeral',
      durable: false,
      label: 'Ephemeral /tmp',
      warning: 'Set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN (free) so queue/sent logs survive and campaigns do not reset.',
    };
  }
  return { mode: 'disk', durable: true, label: 'Local disk' };
}

module.exports = {
  STORE_KEY,
  hasKv,
  downloadStore,
  uploadStore,
  getPersistMode,
};
