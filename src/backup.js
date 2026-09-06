export const BACKUP_INTERVAL_DAYS = 15;
export const BACKUP_SCHEMA_VERSION = 1;

export function backupDue(lastBackupAt, now = new Date(), intervalDays = BACKUP_INTERVAL_DAYS) {
  if (!lastBackupAt) return true;
  const last = new Date(lastBackupAt).getTime();
  const current = new Date(now).getTime();
  if (!Number.isFinite(last) || !Number.isFinite(current)) return true;
  return current - last >= intervalDays * 24 * 60 * 60 * 1000;
}

export function nextBackupAt(lastBackupAt, intervalDays = BACKUP_INTERVAL_DAYS) {
  if (!lastBackupAt) return null;
  const last = new Date(lastBackupAt).getTime();
  if (!Number.isFinite(last)) return null;
  return new Date(last + intervalDays * 24 * 60 * 60 * 1000).toISOString();
}

export function backupFileName(deviceId, createdAt = new Date()) {
  const safeDevice = String(deviceId || '').replace(/[^a-zA-Z0-9._-]/g, '-').slice(0, 64) || 'device';
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) throw new TypeError('Invalid backup date');
  const stamp = date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  return `${stamp}-${safeDevice}.focapy`;
}

export function createBackupPayload({ state, deviceId, createdAt = new Date(), media = [] }) {
  if (!state || typeof state !== 'object' || Array.isArray(state)) throw new TypeError('Backup state must be an object');
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) throw new TypeError('Invalid backup date');
  if (!String(deviceId || '').trim()) throw new TypeError('Backup deviceId is required');
  return {
    schemaVersion: BACKUP_SCHEMA_VERSION,
    deviceId: String(deviceId),
    createdAt: date.toISOString(),
    state: structuredClone(state),
    media: Array.isArray(media) ? structuredClone(media) : [],
  };
}
