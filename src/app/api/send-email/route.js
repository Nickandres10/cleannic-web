import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { nombre, telefono, email, direccion, paquete, observaciones } = await request.json();

    // HTML para el email del administrador
    const adminEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Nueva Solicitud de Servicio</h2>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
          <p><strong>Nombre:</strong> ${nombre}</p>
          <p><strong>Teléfono:</strong> ${telefono}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Dirección:</strong> ${direccion}</p>
          <p><strong>Paquete Seleccionado:</strong> ${paquete}</p>
          <p><strong>Observaciones:</strong> ${observaciones || 'Sin observaciones'}</p>
        </div>
      </div>
    `;

    // HTML para el email del cliente
    const clientEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Solicitud Recibida - Cleannic</h2>
        <p>Hola ${nombre},</p>
        <p>Gracias por solicitar nuestros servicios. Hemos recibido tu solicitud con los siguientes datos:</p>
        <ul style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; list-style: none;">
          <li><strong>Paquete:</strong> ${paquete}</li>
          <li><strong>Teléfono:</strong> ${telefono}</li>
          <li><strong>Dirección:</strong> ${direccion}</li>
        </ul>
        <p>Nos pondremos en contacto pronto para confirmar tu servicio.</p>
        <p>¡Gracias por confiar en Cleannic!</p>
      </div>
    `;

    // Enviar email al administrador
    await resend.emails.send({
      from: 'Cleannic <onboarding@resend.dev>',
      to: 'nickandresp@gmail.com',
      subject: `Nueva Solicitud de Servicio - ${paquete}`,
      html: adminEmailContent,
    });

    // Enviar email de confirmación al cliente
    await resend.emails.send({
      from: 'Cleannic <onboarding@resend.dev>',
      to: email,
      subject: 'Solicitud Recibida - Cleannic',
      html: clientEmailContent,
    });

    return Response.json(
      { success: true, message: 'Email enviado correctamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al enviar email:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
