const nodemailer = require("nodemailer")
require("dotenv").config()

const DatosEmail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

async function EnviarCorreo(email, nombre, TokenEmail) {
  const hipervinculo_validacion = `http://localhost:3000/api/verificacion/${TokenEmail}`
  const opciones = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Confirmar tu cuenta creada en EduTrak ✅",
    html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Arial', sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                    .header { background: linear-gradient(135deg, #558b2f 0%, #66bb6a 100%); padding: 40px 20px; text-align: center; }
                    .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; }
                    .content { padding: 40px 30px; color: #333333; }
                    .content h2 { color: #558b2f; margin-top: 0; }
                    .button { display: inline-block; padding: 14px 32px; background-color: #558b2f; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
                    .button:hover { background-color: #66bb6a; }
                    .footer { background-color: #f9f9f9; padding: 20px; text-align: center; color: #666666; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>📚 EduTrak</h1>
                    </div>
                    <div class="content">
                        <h2>¡Bienvenido, ${nombre}! 👋</h2>
                        <p>Gracias por registrarte en nuestra plataforma educativa. Para completar tu registro, por favor verifica tu cuenta haciendo clic en el siguiente botón:</p>
                        <a href="${hipervinculo_validacion}" class="button">Verificar mi cuenta</a>
                        <p>Si no creaste esta cuenta, puedes ignorar este correo electrónico de forma segura.</p>
                    </div>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} EduTrak - Sistema de Gestión Educativa</p>
                    </div>
                </div>
            </body>
            </html>
        `,
  }
  await DatosEmail.sendMail(opciones)
}

async function EnviarCodigoRecuperacion(email, nombre, codigo) {
  const opciones = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "🔒 Código de recuperación de contraseña - EduTrak",
    html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Arial', sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                    .header { background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%); padding: 40px 20px; text-align: center; }
                    .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; }
                    .content { padding: 40px 30px; color: #333333; text-align: center; }
                    .content h2 { color: #1976d2; margin-top: 0; }
                    .code-box { background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); padding: 30px; border-radius: 10px; margin: 30px 0; border: 2px dashed #1976d2; }
                    .code { font-size: 42px; font-weight: 700; color: #1976d2; letter-spacing: 8px; font-family: 'Courier New', monospace; }
                    .warning { background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; border-radius: 4px; margin: 20px 0; text-align: left; }
                    .footer { background-color: #f9f9f9; padding: 20px; text-align: center; color: #666666; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🔒 EduTrak</h1>
                    </div>
                    <div class="content">
                        <h2>Recuperación de Contraseña</h2>
                        <p>Hola <strong>${nombre}</strong>,</p>
                        <p>Recibimos una solicitud para restablecer tu contraseña. Utiliza el siguiente código de verificación:</p>
                        
                        <div class="code-box">
                            <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">TU CÓDIGO DE VERIFICACIÓN</p>
                            <div class="code">${codigo}</div>
                        </div>
                        
                        <div class="warning">
                            <strong>⚠️ Importante:</strong>
                            <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                                <li>Este código expira en <strong>15 minutos</strong></li>
                                <li>Solo puedes usarlo una vez</li>
                                <li>Si no solicitaste este código, ignora este mensaje</li>
                            </ul>
                        </div>
                    </div>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} EduTrak - Sistema de Gestión Educativa</p>
                        <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
  }
  await DatosEmail.sendMail(opciones)
}

async function EnviarNotificacionAsistencia(email, nombreAlumno, nombreCurso, faltas) {
  const opciones = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "⚠️ Notificación de Asistencia - EduTrak",
    html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Arial', sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                    .header { background: linear-gradient(135deg, #d32f2f 0%, #f44336 100%); padding: 40px 20px; text-align: center; }
                    .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; }
                    .content { padding: 40px 30px; color: #333333; }
                    .content h2 { color: #d32f2f; margin-top: 0; }
                    .info-box { background-color: #ffebee; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d32f2f; }
                    .info-box p { margin: 8px 0; }
                    .faltas-badge { display: inline-block; background-color: #d32f2f; color: white; padding: 8px 16px; border-radius: 20px; font-weight: 600; font-size: 18px; }
                    .recommendation { background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1976d2; }
                    .footer { background-color: #f9f9f9; padding: 20px; text-align: center; color: #666666; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>📚 EduTrak</h1>
                    </div>
                    <div class="content">
                        <h2>⚠️ Notificación de Asistencia</h2>
                        <p>Estimado padre/madre o tutor,</p>
                        <p>Le informamos sobre el registro de asistencia del alumno:</p>
                        
                        <div class="info-box">
                            <p><strong>👤 Alumno:</strong> ${nombreAlumno}</p>
                            <p><strong>📖 Curso:</strong> ${nombreCurso}</p>
                            <p><strong>📅 Fecha:</strong> ${new Date().toLocaleDateString("es-AR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
                            <p style="margin-top: 20px;"><strong>Total de faltas acumuladas:</strong></p>
                            <p style="text-align: center; margin-top: 10px;">
                                <span class="faltas-badge">${faltas} ${faltas === 1 ? "falta" : "faltas"}</span>
                            </p>
                        </div>
                        
                        ${
                          faltas >= 5
                            ? `
                        <div class="recommendation" style="background-color: #ffebee; border-left-color: #d32f2f;">
                            <p><strong>🚨 ALERTA IMPORTANTE</strong></p>
                            <p>El alumno ha alcanzado un número crítico de faltas. Se recomienda contactar con la institución educativa para evaluar la situación y tomar las medidas correspondientes.</p>
                        </div>
                        `
                            : `
                        <div class="recommendation">
                            <p><strong>💡 Recomendación</strong></p>
                            <p>Le sugerimos estar atento a la asistencia del alumno y consultar con los docentes en caso de tener alguna inquietud.</p>
                        </div>
                        `
                        }
                        
                        <p>Para cualquier consulta o justificación de inasistencias, por favor comuníquese con la institución.</p>
                    </div>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} EduTrak - Sistema de Gestión Educativa</p>
                        <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
  }
  await DatosEmail.sendMail(opciones)
}

module.exports = { EnviarCorreo, EnviarCodigoRecuperacion, EnviarNotificacionAsistencia }
