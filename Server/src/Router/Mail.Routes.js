const express = require("express")
const { enviarNotificacion } = require("../Controller/Mail.Controller")

const Ruta = express.Router()

Ruta.post("/notificacion", enviarNotificacion)

module.exports = Ruta
