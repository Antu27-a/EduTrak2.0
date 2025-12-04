const Express = require('express');
const Rutas= Express.Router();

const {RegistroAsistencia}=require('../Controller/RegistrarAsistencia.Controller')

Rutas.post('/RegistroAsistencia',RegistroAsistencia)
module.exports=Rutas