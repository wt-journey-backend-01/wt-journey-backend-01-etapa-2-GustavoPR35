const express = require('express')
const app = express()
const agentesRouter = require('./routes/agentesRoutes')
const casosRouter = require('./routes/casosRoutes')
const setupSwagger = require('./docs/swagger')
const PORT = 3192

app.use(express.json())

// Configurar Swagger
setupSwagger(app)

app.use(agentesRouter)
app.use(casosRouter)
app.use((req, res) => {
    res.status(404).json({
        erro: 'Página não encontrada.'
    })
})

app.listen(PORT, () => {
    console.log(`Servidor do Departamento de Polícia rodando em localhost:${PORT}`)
})