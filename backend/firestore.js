// Firestore helper for HireBridge backend
// Uses firebase-admin if available; falls back to in-memory store
// if Firestore cannot be initialized (e.g., missing credentials).

let admin = null;
let db = null;

try {
  // Lazy require to avoid crashing if module is missing during dev
  // (user must run `npm install` in backend to enable Firestore).
  // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  admin = require('firebase-admin');

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }

  db = admin.firestore();
  console.log('[Firestore] Initialized using application default credentials');
} catch (err) {
  console.warn('[Firestore] Not initialized, running in in-memory mode:', err.message || err);
}

// Simple in-memory fallback store keyed by interviewId
const inMemoryInterviews = new Map();

async function getInterview(interviewId) {
  if (!interviewId) return null;

  if (db) {
    const ref = db.collection('interviews').doc(interviewId);
    const snap = await ref.get();
    if (!snap.exists) return null;
    return { id: snap.id, ...snap.data() };
  }

  return inMemoryInterviews.get(interviewId) || null;
}

async function createOrUpdateInterview(interviewId, payload) {
  if (db) {
    const ref = interviewId
      ? db.collection('interviews').doc(interviewId)
      : db.collection('interviews').doc();

    const data = {
      ...payload,
      updatedAt: new Date().toISOString(),
    };

    await ref.set(data, { merge: true });
    const id = ref.id;
    return { id, ...data };
  }

  const id = interviewId || Math.random().toString(36).substring(2, 10);
  const data = {
    ...payload,
    id,
    updatedAt: new Date().toISOString(),
  };
  inMemoryInterviews.set(id, data);
  return data;
}

module.exports = {
  hasFirestore: !!db,
  getInterview,
  createOrUpdateInterview,
};
