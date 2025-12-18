const encriptar = require('bcrypt');
const salto = 10;

const EncriptarContraseña = async (contraseña) => {
    const Seguridad = await encriptar.genSalt(salto);
    return await encriptar.hash(contraseña, Seguridad);
};

const VerificarContraseña = async (contraseña, hash) => {
    return await encriptar.compare(contraseña, hash);
};

module.exports = {
    EncriptarContraseña,
    VerificarContraseña
};
