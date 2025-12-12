const Express = require('express');
const Rutas= Express.Router();

const { RegistrarUsuarios } = require('../Controller/Login.Controller');
const { IniciarSesion } = require('../Controller/Registro.controller');

Rutas.post('/IniciarSesion', IniciarSesion);

Rutas.post('/RegistrarUsuario', RegistrarUsuarios);

module.exports = Rutas; 