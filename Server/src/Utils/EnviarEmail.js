const nodemailer = require('nodemailer');
require('dotenv').config();

const DatosEmail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

async function EnviarCorreo(email, nombre, TokenEmail) {
    const hipervinculo_validacion = `http://localhost:3000/api/verificacion/${TokenEmail}`;
    const opciones = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Confirmar tu cuenta creada en EduTrak ✅',
        html:
            `
        <h1>Bienvenido a EduTrak, ${nombre} 👋</h1>
        <p>Gracias por registrarte en nuestra plataforma. Por favor, haz clic en el siguiente enlace para verificar tu cuenta:</p>
        <a href="${hipervinculo_validacion}">Verificar mi cuenta</a>
        <p>Si no creaste esta cuenta, puedes ignorar este correo electrónico.</p>
        `
    };
    await DatosEmail.sendMail(opciones);
}

module.exports={EnviarCorreo}