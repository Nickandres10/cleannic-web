export async function POST(request) {
  const { email, telefono } = await request.json();

  if (!email || !telefono) {
    return Response.json({ error: 'Email and phone required' }, { status: 400 });
  }

  const token = Buffer.from(`${email}:${telefono}`).toString('base64');

  return Response.json({
    token,
    user: { email, telefono },
  });
}
