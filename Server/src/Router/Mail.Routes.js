import express from "express";


const {enviarNotificacion}=require("../controllers/mail.controller.js")

const Ruta = express.Router();

Ruta.post("/notificacion", enviarNotificacion);

export default Ruta;