const Express=require('express')
const App=Express()

require('dotenv').config()

const PORT=process.env.PORT||5000

App.use(Express.json())
const cors=require('cors')
App.use(cors())

const Router=require('./src/Router/Login.Routes')

const Registraralumno=require('./src/Router/RegistrarAlumno.Routes')
const Registrarasistencia=require('./src/Router/RegistrarAsistencia.Routes')
const Registrarcurso=require('./src/Router/RegistrarCurso.Routes')

App.use('/api',Router)
App.use('/api',Registraralumno)
App.use('/api',Registrarasistencia)
App.use('/api',Registrarcurso)




App.listen(PORT,()=>{
    console.log(`🚀http://localhost:${PORT}`)
})
