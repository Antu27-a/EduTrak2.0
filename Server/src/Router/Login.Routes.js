const Express = require('express');
const Rutas= Express.Router();

const { RegistrarUsuarios } = require('../Controller/Login.Controller');

Rutas.post('/RegistrarUsuario', RegistrarUsuarios);
module.exports = Rutas; 