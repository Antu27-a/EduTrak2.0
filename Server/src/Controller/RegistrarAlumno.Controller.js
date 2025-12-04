const db=require ('../DataBase/db');

const RegistroAlumno = async (req, res) => {
    const { nombre,apellido,email, id_curso } = req.body;
    console.log(req.body);
    try {
        if(!nombre||!apellido||!email||!id_curso){
            return res.status(404).json({Error:'Faltan datos obligatorios 🤬'});
        }
        const query = `
            INSERT INTO Alumno (nombre,apellido,email,id_curso) VALUES (?,?,?,?)
            `
        db.run(query, [nombre,apellido,email,id_curso], async (error) => {
            if (error) {
                console.error('Revisar query', error.message);
                return res.status(400).json({ Error: 'El Alumno ya se encuentra registrado' });
            }
            res.json({
                message: 'Alumno registrado correctamente'

            })
        })
    }
    catch (Error) {

    }
}
module.exports={RegistroAlumno}