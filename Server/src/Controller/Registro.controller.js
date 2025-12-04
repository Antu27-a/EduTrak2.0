const db = require('../DataBase/db');
const { GenerarToken } = require('../Utils/Token');
const { EnviarCorreo } = require('../Utils/EnviarEmail');
const { EncriptarContraseña } = require('../Utils/PasswordHash');

const RegistroUsuario = async (req, res) => {
    const { email, contraseña, nombre, rol } = req.body;
    console.log(req.body);
    try {
        
        if(!email||!contraseña||!nombre||!rol){
            return res.status(404).json({Error:'Faltan datos obligatorios 🤬'});
        }

    
        const hash = await EncriptarContraseña(contraseña);
        const Token = GenerarToken({ email });
        const query = `
            INSERT INTO Usuario (email,contraseña,nombre,rol,verificacion, TokenEmail) VALUES (?,?,?,?,?,?)
            `
        db.run(query, [email, hash, nombre, rol, Token], async (error) => {
            if (error) {
                console.error('Revisar query', error.message);
                return res.status(400).json({ Error: 'El usuario ya existe' });
            }
            await EnviarCorreo(email, Token);
            res.json({
                message: 'Usuario registrado correctamente, por favor verifica tu correo electrónico'

            })
        })
    }
    catch (Error) {

    }
}

module.exports={RegistroUsuario}