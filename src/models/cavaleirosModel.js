const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data', 'cavaleiros.json');

function ensureFile() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, '[]', 'utf8');
    }
  } catch (err) {
    // ignore - upstream code will surface errors when trying to read/write
  }
}

function readStore() {
  try {
    ensureFile();
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const arr = JSON.parse(raw || '[]');
    return Array.isArray(arr) ? arr : [];
  } catch (err) {
    // if parse error or other IO error, return empty array to avoid throwing in common flows
    return [];
  }
}

function writeStore(arr) {
  try {
    // atomic write: write to temp file then rename
    const tmp = DATA_FILE + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(arr, null, 2), 'utf8');
    fs.renameSync(tmp, DATA_FILE);
  } catch (err) {
    // rethrow so callers can handle when persistence fails
    throw err;
  }
}

function add(cavaleiro) {
  const store = readStore();
  store.push(cavaleiro);
  // debug log to help diagnose persistence issues
  try {
    console.log('[cavaleirosModel] Persisting new cavaleiro to', DATA_FILE);
    writeStore(store);
    console.log('[cavaleirosModel] Persisted successfully. Total items:', store.length);
  } catch (err) {
    console.error('[cavaleirosModel] Error persisting cavaleiro:', err && err.message);
    throw err;
  }
}

function existsById(id) {
  const store = readStore();
  return store.some(c => c.id === id);
}

function clear() {
  writeStore([]);
}

function getAll() {
  return readStore();
}

const api = { add, existsById, clear, getAll };
Object.defineProperty(api, '_store', { get: readStore });

module.exports = api;
