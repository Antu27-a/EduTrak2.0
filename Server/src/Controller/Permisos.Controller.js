const db = require("../DataBase/db")

const CambiarRolUsuario = (req, res) => {
    const { id } = req.params
    const { rol } = req.body

    if (!rol) {
        return res.status(400).json({ Error: "Rol requerido" })
    }

    const query = `UPDATE Usuario SET rol=? WHERE id_user=?`
    db.run(query, [rol, id], function (Error) {
        if (Error) {
            return res.status(500).json({ Error: "Error al cambiar rol" })
        }
        return res.status(200).json({
            Mensaje: "Rol actualizado correctamente",
        })
    })
}

module.exports = { CambiarRolUsuario }
