import nodemailer from 'nodemailer';
import { env } from '../config/env';

const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: env.EMAIL_PORT,
  secure: env.EMAIL_PORT === 465,
  auth: {
    user: env.EMAIL_USER_NOTICES,
    pass: env.EMAIL_PASSWORD_NOTICES,
  },
});

export const sendWelcomeEmail = async (email: string, clientName: string, vetName: string, usuario: string, contrasenia: string) => {
  const mailOptions = {
    from: `"VetGestion" <${env.EMAIL_FROM_NOTICES}>`,
    to: email,
    subject: `¡Bienvenido a VetGestion, ${clientName}!`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <div style="background-color: #09090b; padding: 24px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px;">¡Bienvenido a VetGestion!</h1>
          <p style="margin: 4px 0 0; font-size: 14px; opacity: 0.8;">Tu plataforma SaaS de administración veterinaria</p>
        </div>
        <div style="padding: 24px;">
          <h2 style="margin-top: 0; color: #09090b;">Hola, ${clientName}</h2>
          <p>Hemos registrado correctamente tu clínica veterinaria <b>${vetName}</b> en nuestro sistema.</p>
          <p>A continuación se detallan tus credenciales administrativas para que puedas comenzar de inmediato:</p>
          
          <div style="background-color: #f4f4f5; padding: 16px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0 0 8px;"><b>Veterinaria:</b> ${vetName}</p>
            <p style="margin: 0 0 8px;"><b>Usuario:</b> <code style="background-color: #e4e4e7; padding: 2px 4px; border-radius: 3px;">${usuario}</code></p>
            <p style="margin: 0;"><b>Contraseña:</b> <code style="background-color: #e4e4e7; padding: 2px 4px; border-radius: 3px;">${contrasenia}</code></p>
          </div>

          <p style="margin-bottom: 24px;">Te recomendamos cambiar esta contraseña en la sección <b>Mi Cuenta</b> al iniciar sesión por primera vez.</p>
          
          <div style="text-align: center;">
            <a href="http://localhost:3000/login" style="background-color: #09090b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Iniciar Sesión</a>
          </div>
        </div>
        <div style="background-color: #f4f4f5; padding: 16px; text-align: center; font-size: 12px; color: #71717a; border-top: 1px solid #e4e4e7;">
          <p style="margin: 0;">Este es un correo automático. Por favor no respondas a este mensaje.</p>
          <p style="margin: 4px 0 0;">© ${new Date().getFullYear()} VetGestion. Todos los derechos reservados.</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Welcome] Sent successfully: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`[Email Welcome] Failed to send email to ${email}:`, error);
  }
};
