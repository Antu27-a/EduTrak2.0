const Express = require('express');
const Rutas= Express.Router();

const {RegistroCurso}=require('../Controller/RegistrarCurso.Controller')

Rutas.post('/RegistroCurso',RegistroCurso)
module.exports=Rutas