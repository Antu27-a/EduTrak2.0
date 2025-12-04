const Express = require('express');
const Rutas= Express.Router();

const {RegistroUsuario}=require('../Controller/Registro.controller')
const {VerificacionToken}=require('../Utils/Token')

const db=require('../DataBase/db')

Rutas.post('/registrousuario',RegistroUsuario)

Rutas.get('/verificacion/:Token',(req,res)=>{
    const{Token}=req.params;
    console.log(req.params);
    try{
        const decoded=VerificacionToken(Token)
        db.run()
        query='UPDATE Usuario SET Verificacion=1, TokenEmail=NULL WHERE Email=?'
        db.run(query,[decoded.email],(error)=>{
            if(error){
                console.error('Error en la verificacion del usuario')
                return res.status(500).send("Error al verificar el usuario")
            }
            res.send("<h1>Cuenta Verificada Correctamente</h1>")
        })
    }
    catch(Error){

    }
})

module.exports=Rutas;