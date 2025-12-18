import nodemailer from "nodemailer";

const enviarNotificacion = async (req, res) => {
  const { email, nombre, apellido, faltas } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Sistema Escolar" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Notificación por inasistencias",
      html: `
        <h2>Notificación de inasistencias</h2>
        <p>Estimado/a <strong>${apellido}, ${nombre}</strong>:</p>
        <p>Se le informa que acumula <strong>${faltas} faltas</strong>.</p>
        <p>Si no asiste, quedara libre🥚</p>
        <br/>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Mail enviado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al enviar el mail" });
  }
};

module.exports = {
  enviarNotificacion,
};
