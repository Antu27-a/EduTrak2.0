const encriptar = require('bcrypt');
const salto = 10;

const EncriptarContraseña=async(contraseña)=>{
    const Seguridad= await encriptar.genSalt(salto);
    return encriptar.hash(contraseña,Seguridad);
}

module.exports={EncriptarContraseña};
