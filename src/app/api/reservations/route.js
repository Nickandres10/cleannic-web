import { readReservations, addReservation, updateReservation } from '@/lib/db';

export async function GET(request) {
  const url = new URL(request.url);
  const email = url.searchParams.get('email');
  const admin = url.searchParams.get('admin');

  const reservations = await readReservations();

  if (admin === 'true') {
    return Response.json(reservations);
  }

  if (email) {
    const filtered = reservations.filter(r => r.email === email);
    return Response.json(filtered);
  }

  return Response.json([]);
}

export async function POST(request) {
  const data = await request.json();
  const reservation = await addReservation(data);
  return Response.json(reservation, { status: 201 });
}

export async function PATCH(request) {
  const data = await request.json();
  const { id, ...updates } = data;

  if (!id) {
    return Response.json({ error: 'ID required' }, { status: 400 });
  }

  const updated = await updateReservation(id, updates);
  if (!updated) {
    return Response.json({ error: 'Reservation not found' }, { status: 404 });
  }

  return Response.json(updated);
}
