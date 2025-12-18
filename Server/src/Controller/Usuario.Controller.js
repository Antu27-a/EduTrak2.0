const db = require("../DataBase/db")
const { GenerarToken } = require("../Utils/Token")
const { EncriptarContraseña, VerificarContraseña } = require("../Utils/PasswordHash")

const ObtenerUsuarios = async (req, res) => {
  try {
    const query = `SELECT id_user, email, nombre, rol FROM Usuario`
    db.all(query, [], (error, usuarios) => {
      if (error) {
        console.error("Error al obtener usuarios:", error.message)
        return res.status(500).json({ Error: "Error al obtener usuarios" })
      }
      res.status(200).json(usuarios)
    })
  } catch (error) {
    console.error("Error en ObtenerUsuarios:", error)
    res.status(500).json({ Error: "Error del servidor" })
  }
}

const ObtenerUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params
    const query = `SELECT id_user, email, nombre, rol FROM Usuario WHERE id_user=?`
    db.get(query, [id], (error, usuario) => {
      if (error) {
        console.error("Error al obtener usuario:", error.message)
        return res.status(500).json({ Error: "Error al obtener usuario" })
      }
      if (!usuario) {
        return res.status(404).json({ Error: "Usuario no encontrado" })
      }
      res.status(200).json(usuario)
    })
  } catch (error) {
    console.error("Error en ObtenerUsuarioPorId:", error)
    res.status(500).json({ Error: "Error del servidor" })
  }
}

const ActualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params
    const { email, nombre, rol, contraseña } = req.body

    const campos = []
    const params = []

    if (email !== undefined) {
      campos.push("email=?")
      params.push(email)
    }

    if (nombre !== undefined) {
      campos.push("nombre=?")
      params.push(nombre)
    }

    if (rol !== undefined) {
      campos.push("rol=?")
      params.push(rol)
    }

    if (contraseña !== undefined && contraseña !== "") {
      const hash = await EncriptarContraseña(contraseña)
      campos.push("contraseña=?")
      params.push(hash)
    }

    if (campos.length === 0) {
      return res.status(400).json({ Error: "No hay campos para actualizar" })
    }

    params.push(id)
    const query = `UPDATE Usuario SET ${campos.join(", ")} WHERE id_user=?`

    db.run(query, params, function (error) {
      if (error) {
        console.error("Error al actualizar usuario:", error.message)
        return res.status(500).json({ Error: "Error al actualizar usuario" })
      }
      if (this.changes === 0) {
        return res.status(404).json({ Error: "Usuario no encontrado" })
      }
      res.status(200).json({ Mensaje: "Usuario actualizado correctamente" })
    })
  } catch (error) {
    console.error("Error en ActualizarUsuario:", error)
    res.status(500).json({ Error: "Error del servidor" })
  }
}

const EliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params
    const query = `DELETE FROM Usuario WHERE id_user=?`
    db.run(query, [id], function (error) {
      if (error) {
        console.error("Error al eliminar usuario:", error.message)
        return res.status(500).json({ Error: "Error al eliminar usuario" })
      }
      if (this.changes === 0) {
        return res.status(404).json({ Error: "Usuario no encontrado" })
      }
      res.status(200).json({ Mensaje: "Usuario eliminado correctamente" })
    })
  } catch (error) {
    console.error("Error en EliminarUsuario:", error)
    res.status(500).json({ Error: "Error del servidor" })
  }
}

module.exports = {
  ObtenerUsuarios,
  ObtenerUsuarioPorId,
  ActualizarUsuario,
  EliminarUsuario,
}
