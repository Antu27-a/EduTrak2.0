const Express = require('express');
const Rutas= Express.Router();

const {RegistroAlumno}=require('../Controller/RegistrarAlumno.Controller')

Rutas.post('/RegistroAlumno',RegistroAlumno)
module.exports=Rutas