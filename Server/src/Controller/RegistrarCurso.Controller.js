const db=require ('../DataBase/db');

const RegistroCurso = async (req, res) => {
    const { curso,turno } = req.body;
    console.log(req.body);
    try {
        if(!curso||!turno){
            return res.status(404).json({Error:'Faltan datos obligatorios 🤬'});
        }
        const query = `
            INSERT INTO Curso (curso,turno) VALUES (?,?)
            `
        db.run(query, [curso,turno], async (error) => {
            if (error) {
                console.error('Revisar query', error.message);
                return res.status(400).json({ Error: 'El curso ya existe' });
            }
            res.json({
                message: 'Curso registrado correctamente'

            })
        })
    }
    catch (Error) {

    }
}

module.exports={RegistroCurso}