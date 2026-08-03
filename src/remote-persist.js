/**
 * Durable store persistence for serverless (Vercel Blob).
 * Supports OIDC (BLOB_STORE_ID + VERCEL_OIDC_TOKEN) and static BLOB_READ_WRITE_TOKEN.
 */

const STORE_PATHNAME = 'reachly/store.json';

function hasBlobConfig() {
  return Boolean(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN);
}

function blobOptions(extra = {}) {
  const opts = { ...extra };
  // Prefer SDK auto-auth (OIDC on Vercel). Only pass static token when present.
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    opts.token = process.env.BLOB_READ_WRITE_TOKEN;
  }
  if (process.env.BLOB_STORE_ID) {
    opts.storeId = process.env.BLOB_STORE_ID;
  }
  return opts;
}

async function downloadStore() {
  if (!hasBlobConfig()) return null;
  try {
    const { list, get } = require('@vercel/blob');
    const { blobs } = await list(blobOptions({
      prefix: STORE_PATHNAME,
      limit: 5,
    }));
    const match = blobs.find(b => b.pathname === STORE_PATHNAME) || blobs[0];
    if (!match) return null;

    // Prefer get() for private blobs
    if (typeof get === 'function') {
      const result = await get(match.url || STORE_PATHNAME, blobOptions());
      if (!result) return null;
      const stream = result.stream || result.body;
      if (result.statusCode === 404) return null;
      if (typeof result.text === 'function') {
        const text = await result.text();
        return text ? JSON.parse(text) : null;
      }
      if (Buffer.isBuffer(result)) {
        return JSON.parse(result.toString('utf8'));
      }
      if (stream) {
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        const text = Buffer.concat(chunks).toString('utf8');
        return text ? JSON.parse(text) : null;
      }
    }

    const res = await fetch(match.url, {
      headers: process.env.BLOB_READ_WRITE_TOKEN
        ? { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` }
        : {},
    });
    if (!res.ok) {
      console.warn(`[persist] Blob download failed: ${res.status}`);
      return null;
    }
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  } catch (err) {
    console.warn('[persist] Blob download error:', err.message);
    return null;
  }
}

async function uploadStore(data) {
  if (!hasBlobConfig()) return false;
  try {
    const { put } = require('@vercel/blob');
    const payload = JSON.stringify(data);
    await put(STORE_PATHNAME, payload, blobOptions({
      access: 'private',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
    }));
    return true;
  } catch (err) {
    console.error('[persist] Blob upload error:', err.message);
    return false;
  }
}

function getPersistMode(isServerless) {
  if (hasBlobConfig()) {
    const via = process.env.BLOB_STORE_ID ? 'OIDC/store' : 'token';
    return { mode: 'blob', durable: true, label: `Vercel Blob (${via})` };
  }
  if (isServerless) {
    return {
      mode: 'ephemeral',
      durable: false,
      label: 'Ephemeral /tmp (not durable)',
      warning: 'Sent logs and queue can reset on Vercel. Connect Blob store to this project (BLOB_STORE_ID), or run on Railway.',
    };
  }
  return { mode: 'disk', durable: true, label: 'Local disk' };
}

// Back-compat alias used by store.js
function hasBlobToken() {
  return hasBlobConfig();
}

module.exports = {
  STORE_PATHNAME,
  hasBlobToken,
  hasBlobConfig,
  downloadStore,
  uploadStore,
  getPersistMode,
};
