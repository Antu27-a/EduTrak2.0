const SQLite3 = require('sqlite3')

const Ruta=require('path')

const SQLite3_Ubicacion=Ruta.resolve(__dirname, './Edutrak.db')

const db_crear=new SQLite3.Database(SQLite3_Ubicacion, (error)=>{
    if(error){
        console.error('No se pudo crear correctamente la base de datos 🤬', error.message)
    }
    else{
        console.log('Base de datos creada correctamente 👻👻👻')
        db_crear.exec(
            `
            PRAGMA foreign_keys = ON;

            CREATE TABLE IF NOT EXISTS Usuario (
                id_user INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL UNIQUE,
                contraseña TEXT NOT NULL,
                nombre TEXT,
                rol TEXT NOT NULL CHECK (rol IN ('preceptor','admin'))
            );

            CREATE TABLE IF NOT EXISTS Curso (
                id_curso INTEGER PRIMARY KEY AUTOINCREMENT,
                curso TEXT NOT NULL,
                turno TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS Alumno (
                id_alumno INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                apellido TEXT NOT NULL,
                email TEXT,
                id_curso INTEGER NOT NULL,
                FOREIGN KEY (id_curso) REFERENCES Curso(id_curso)
                    ON DELETE RESTRICT
            );

            CREATE TABLE IF NOT EXISTS Asistencia (
                id_asistencia INTEGER PRIMARY KEY AUTOINCREMENT,
                fecha TEXT NOT NULL,
                estado TEXT NOT NULL CHECK (estado IN ('Presente', 'Ausente', 'Justificado')),
                notificacion TEXT,
                id_usuario INTEGER NOT NULL,
                id_alumno INTEGER NOT NULL,
                FOREIGN KEY (id_usuario) REFERENCES Usuario(id_user)
                    ON DELETE CASCADE,
                FOREIGN KEY (id_alumno) REFERENCES Alumno(id_alumno)
                    ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS Curso_Preceptor (
                id_asignacion INTEGER PRIMARY KEY AUTOINCREMENT,
                id_usuario INTEGER NOT NULL,
                id_curso INTEGER NOT NULL,
                FOREIGN KEY (id_usuario) REFERENCES Usuario(id_user)
                    ON DELETE CASCADE,
                FOREIGN KEY (id_curso) REFERENCES Curso(id_curso)
                    ON DELETE CASCADE,
                UNIQUE(id_usuario, id_curso)
            );

            CREATE TABLE IF NOT EXISTS Password_Reset (
                id_reset INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL,
                codigo TEXT NOT NULL,
                expiracion TEXT NOT NULL,
                usado INTEGER DEFAULT 0,
                creado TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (email) REFERENCES Usuario(email)
                    ON DELETE CASCADE
            );
            `,(error)=>{
                if(error){
                    console.error('Error al crear las tablas 🤬', error.message)
                }
                else{
                    console.log('Tablas creadas correctamente 👻👻👻')
                }
            }
        )
    }
})

module.exports=db_crear;