import { readReservations } from '@/lib/db';

export async function GET(request) {
  const url = new URL(request.url);
  const reservationId = url.searchParams.get('id');

  if (!reservationId) {
    return Response.json({ error: 'Reservation ID required' }, { status: 400 });
  }

  const reservations = await readReservations();
  const reservation = reservations.find(r => r.id === reservationId);

  if (!reservation) {
    return Response.json({ error: 'Reservation not found' }, { status: 404 });
  }

  const createdTime = new Date(reservation.createdAt);
  const now = new Date();
  const elapsedMinutes = Math.floor((now - createdTime) / (1000 * 60));

  let status = 'received';
  if (elapsedMinutes >= 15) {
    status = 'scheduled';
  } else if (elapsedMinutes >= 5) {
    status = 'confirmed';
  }

  const percentComplete = Math.min((elapsedMinutes / 15) * 100, 100);

  return Response.json({
    status: reservation.status || status,
    elapsedMinutes,
    percentComplete,
    createdAt: reservation.createdAt,
  });
}
