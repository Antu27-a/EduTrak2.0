const db= require ('../DataBase/db');
const { EncriptarContraseña } = require('../Utils/PasswordHash');

const RegistrarUsuarios=async(req,res)=>{
    try{
        const{email,contraseña,nombre,rol}=req.body;
        if(!email||!contraseña||!nombre||!rol){
            return res.status(404).json({Error:'Faltan datos obligatorios 🤬'});
        }

        const query2=`SELECT * FROM Usuario WHERE email=?`
        db.get(query2,[email],(Error,Tabla)=>{
            if(Error){
                console.error('🤬 error al verificar la existencia del usuario debido a ', Error.message);
                return res.status(404).json({Error:'Error al registrar el usuario 🤬'});
            }
            if(Tabla){
                return res.status(409).json({Error:'El usuario ya se encuentra registrado😵‍💫'});
            }
        })

        const hash= await EncriptarContraseña(contraseña);

        const query=`INSERT INTO Usuario (email,contraseña,nombre,rol) VALUES (?,?,?,?)`;
        db.run(query,[email,hash,nombre,rol],(Error)=>{
            if(Error){
                console.error('Error al registrar el usuario 🤬', Error.message);
                return res.status(404).json({Error:'Error al registrar el usuario 🤬'});
            }else{
                return  res.status(201).json({
                    Mensaje:'Usuario registrado correctamente 👻',
                    ID: this.lastID,
                    email
                });
            }
        })
    }
    catch(Error){
        return res.status(500).json({Error:'Error del servidor 🔥'});
    }
}

module.exports={RegistrarUsuarios};