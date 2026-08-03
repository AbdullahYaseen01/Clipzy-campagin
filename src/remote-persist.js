/**
 * Durable store persistence for serverless (Vercel Blob).
 * Without BLOB_READ_WRITE_TOKEN, data lives only in /tmp and is lost on cold starts.
 */

const STORE_PATHNAME = 'reachly/store.json';

function hasBlobToken() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function downloadStore() {
  if (!hasBlobToken()) return null;
  try {
    const { list } = require('@vercel/blob');
    const { blobs } = await list({
      prefix: STORE_PATHNAME,
      limit: 5,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    const match = blobs.find(b => b.pathname === STORE_PATHNAME) || blobs[0];
    if (!match?.url) return null;
    const res = await fetch(match.url, {
      headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
    });
    if (!res.ok) {
      console.warn(`[persist] Blob download failed: ${res.status}`);
      return null;
    }
    const text = await res.text();
    if (!text) return null;
    return JSON.parse(text);
  } catch (err) {
    console.warn('[persist] Blob download error:', err.message);
    return null;
  }
}

async function uploadStore(data) {
  if (!hasBlobToken()) return false;
  try {
    const { put } = require('@vercel/blob');
    const payload = JSON.stringify(data);
    await put(STORE_PATHNAME, payload, {
      access: 'private',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return true;
  } catch (err) {
    console.error('[persist] Blob upload error:', err.message);
    return false;
  }
}

function getPersistMode(isServerless) {
  if (hasBlobToken()) {
    return { mode: 'blob', durable: true, label: 'Vercel Blob (durable)' };
  }
  if (isServerless) {
    return {
      mode: 'ephemeral',
      durable: false,
      label: 'Ephemeral /tmp (not durable)',
      warning: 'Sent logs and queue can reset on Vercel. Add BLOB_READ_WRITE_TOKEN in Vercel env, or run on Railway for 24/7 sending.',
    };
  }
  return { mode: 'disk', durable: true, label: 'Local disk' };
}

module.exports = {
  STORE_PATHNAME,
  hasBlobToken,
  downloadStore,
  uploadStore,
  getPersistMode,
};
