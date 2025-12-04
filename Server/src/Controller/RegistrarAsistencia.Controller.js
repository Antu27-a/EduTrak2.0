const db=require ('../DataBase/db');

const RegistroAsistencia = async (req, res) => {
    const { fecha,estado,notificacion,id_usuario,id_alumno } = req.body;
    console.log(req.body);
    try {
        if(!fecha||!estado||!notificacion||!id_usuario||!id_alumno){
            return res.status(404).json({Error:'Faltan datos obligatorios 🤬'});
        }
        const query = `
            INSERT INTO Asistencia (fecha,estado,notificacion,id_usuario,id_alumno) VALUES (?,?,?,?,?)
            `
        db.run(query, [curso,turno], async (error) => {
            if (error) {
                console.error('Revisar query', error.message);
                return res.status(400).json({ Error: 'la asistencia ya se encuentra registrada' });
            }
            res.json({
                message: 'asistencia registrada correctamente'

            })
        })
    }
    catch (Error) {

    }
}
module.exports={RegistroAsistencia}