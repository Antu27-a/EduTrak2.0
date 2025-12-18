const db = require("../DataBase/db")
const { EnviarCodigoRecuperacion } = require("../Utils/EnviarEmail")
const { EncriptarContraseña } = require("../Utils/PasswordHash")


const generarCodigo = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}


const SolicitarRecuperacion = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ Error: "El email es obligatorio" })
    }

    const query = `SELECT * FROM Usuario WHERE email=?`
    db.get(query, [email], async (error, usuario) => {
      if (error) {
        console.error("Error al buscar usuario:", error.message)
        return res.status(500).json({ Error: "Error del servidor" })
      }

      if (!usuario) {
        return res.status(404).json({ Error: "Usuario no encontrado" })
      }

     
      const codigo = generarCodigo()
      const expiracion = new Date(Date.now() + 15 * 60 * 1000) 

      const insertQuery = `INSERT INTO Password_Reset (email, codigo, expiracion) VALUES (?, ?, ?)`
      db.run(insertQuery, [email, codigo, expiracion.toISOString()], async (error) => {
        if (error) {
          console.error("Error al guardar código:", error.message)
          return res.status(500).json({ Error: "Error al generar código" })
        }

        try {
          await EnviarCodigoRecuperacion(email, usuario.nombre, codigo)
          return res.status(200).json({
            Mensaje: "Código enviado al correo electrónico",
          })
        } catch (emailError) {
          console.error("Error al enviar email:", emailError)
          return res.status(500).json({ Error: "Error al enviar el código por email" })
        }
      })
    })
  } catch (error) {
    console.error("Error en SolicitarRecuperacion:", error)
    return res.status(500).json({ Error: "Error del servidor" })
  }
}


const VerificarCodigo = async (req, res) => {
  try {
    const { email, codigo } = req.body

    if (!email || !codigo) {
      return res.status(400).json({ Error: "Email y código son obligatorios" })
    }

  
    const query = `
      SELECT * FROM Password_Reset 
      WHERE email=? AND codigo=? AND usado=0 
      ORDER BY id_reset DESC LIMIT 1
    `

    db.get(query, [email, codigo], (error, reset) => {
      if (error) {
        console.error("Error al verificar código:", error.message)
        return res.status(500).json({ Error: "Error del servidor" })
      }

      if (!reset) {
        return res.status(400).json({ Error: "Código inválido o ya utilizado" })
      }

      const ahora = new Date()
      const expiracion = new Date(reset.expiracion)

      if (ahora > expiracion) {
        return res.status(400).json({ Error: "El código ha expirado" })
      }

      return res.status(200).json({
        Mensaje: "Código verificado correctamente",
        id_reset: reset.id_reset,
      })
    })
  } catch (error) {
    console.error("Error en VerificarCodigo:", error)
    return res.status(500).json({ Error: "Error del servidor" })
  }
}

const CambiarContraseña = async (req, res) => {
  try {
    const { email, codigo, nuevaContraseña } = req.body

    if (!email || !codigo || !nuevaContraseña) {
      return res.status(400).json({ Error: "Todos los campos son obligatorios" })
    }

    const queryReset = `
      SELECT * FROM Password_Reset 
      WHERE email=? AND codigo=? AND usado=0 
      ORDER BY id_reset DESC LIMIT 1
    `

    db.get(queryReset, [email, codigo], async (error, reset) => {
      if (error) {
        console.error("Error al verificar código:", error.message)
        return res.status(500).json({ Error: "Error del servidor" })
      }

      if (!reset) {
        return res.status(400).json({ Error: "Código inválido o ya utilizado" })
      }

      const ahora = new Date()
      const expiracion = new Date(reset.expiracion)

      if (ahora > expiracion) {
        return res.status(400).json({ Error: "El código ha expirado" })
      }

    
      const hash = await EncriptarContraseña(nuevaContraseña)

      const updateQuery = `UPDATE Usuario SET contraseña=? WHERE email=?`
      db.run(updateQuery, [hash, email], (error) => {
        if (error) {
          console.error("Error al actualizar contraseña:", error.message)
          return res.status(500).json({ Error: "Error al cambiar la contraseña" })
        }

        const markUsedQuery = `UPDATE Password_Reset SET usado=1 WHERE id_reset=?`
        db.run(markUsedQuery, [reset.id_reset], (error) => {
          if (error) {
            console.error("Error al marcar código como usado:", error.message)
          }
        })

        return res.status(200).json({
          Mensaje: "Contraseña cambiada correctamente",
        })
      })
    })
  } catch (error) {
    console.error("Error en CambiarContraseña:", error)
    return res.status(500).json({ Error: "Error del servidor" })
  }
}

module.exports = {
  SolicitarRecuperacion,
  VerificarCodigo,
  CambiarContraseña,
}
