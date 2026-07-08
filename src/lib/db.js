import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = 'data';
const DATA_FILE = path.join(DATA_DIR, 'reservations.json');

async function ensureDataFile() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }

  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
  }
}

export async function readReservations() {
  await ensureDataFile();
  const content = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(content || '[]');
}

export async function writeReservations(reservations) {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(reservations, null, 2));
}

export async function addReservation(reservation) {
  const reservations = await readReservations();
  const newReservation = {
    ...reservation,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    status: 'received',
  };
  reservations.unshift(newReservation);
  await writeReservations(reservations);
  return newReservation;
}

export async function updateReservation(id, updates) {
  const reservations = await readReservations();
  const index = reservations.findIndex(r => r.id === id);
  if (index === -1) return null;

  reservations[index] = {
    ...reservations[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await writeReservations(reservations);
  return reservations[index];
}
