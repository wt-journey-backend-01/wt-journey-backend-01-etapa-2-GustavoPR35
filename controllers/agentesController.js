const agentesRepository = require('../repositories/agentesRepository')
const { v4: uuidv4, validate: uuidValidate } = require('uuid')

// GET /agentes
function getAllAgentes(req, res) {
    const { cargo, sort } = req.query
    let agentes = agentesRepository.getAll()

    if (agentes.length === 0) {
        return res.status(200).json({
            mensagem: 'Não há nenhum agente cadastrado.'
        })
    }

    if (cargo) {
        console.log("filtrando...")
        agentes = agentes.filter(a => a.cargo.toLowerCase() === cargo.toLowerCase())
    }

    if (sort === 'dataDeIncorporacao' || sort === '-dataDeIncorporacao') {
        console.log("ordenando...")
        const crescente = sort === 'dataDeIncorporacao'
        agentes.sort((a, b) => {
            const dateA = new Date(a.dataDeIncorporacao)
            const dateB = new Date(b.dataDeIncorporacao)
            return crescente ? dateA - dateB : dateB - dateA
        })
    }

    res.status(200).json(agentes)
}

// GET /agentes/:id
function getAgenteById(req, res) {
    const { id } = req.params
    const agente = agentesRepository.getAgenteById(id)

    if (!uuidValidate(id)) {
        return res.status(400).json({
            error: 'Id inválido'
        })
    }

    if (!agente) {
        return res.status(404).json({
            error: 'Agente não encontrado'
        })
    }

    res.status(200).json(agente)
}

// POST /agentes
function insertAgente(req, res) {
    const { nome, dataDeIncorporacao, cargo } = req.body

    if (!nome || !dataDeIncorporacao || !cargo) {
        return res.status(400).json({
            erro: 'Todos os dados são obrigatórios: nome, dataDeIncorporacao, cargo'
        })
    }

    const agente = {
        id: uuidv4(), // Gera automaticamente um UUID único
        nome,
        dataDeIncorporacao,
        cargo
    }
    agentesRepository.insertAgente(agente)
    // console.log('agente inserido: ', agente.id)
    res.status(201).json(agente)
}

// PUT /agentes/:id
function putAgente(req, res) {
    const { id } = req.params
    const { nome, dataDeIncorporacao, cargo } = req.body

    if (!uuidValidate(id)) {
        return res.status(400).json({
            error: 'Id inválido'
        })
    }

    const agenteExists = agentesRepository.getAgenteById(id)
    if (!agenteExists) {
        return res.status(404).json({
            erro: 'Agente não encontrado.'
        })
    }

    if (!nome || !dataDeIncorporacao || !cargo) {
        return res.status(400).json({
            erro: 'Todos os campos devem ser atualizados: nome, dataDeIncorporacao, cargo'
        })
    }

    const agenteUpdate = {
        id,
        nome,
        dataDeIncorporacao,
        cargo
    }
    agentesRepository.updateAgente(agenteUpdate)
    res.status(200).json(agenteUpdate)
}

// PATCH /agentes/:id
function patchAgente(req, res) {
    const { id } = req.params
    const updateData = req.body

    if (!uuidValidate(id)) {
        return res.status(400).json({
            error: 'Id inválido'
        })
    }

    const agenteExists = agentesRepository.getAgenteById(id)
    if (!agenteExists) {
        return res.status(404).json({
            erro: 'Agente não encontrado.'
        })
    }

    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
            erro: 'Pelo menos um campo deve ser atualizado.'
        })
    }

    const agenteUpdate = {
        ...agenteExists,
        ...updateData,
        id: id
    }
    agentesRepository.updateAgente(agenteUpdate)
    res.status(200).json(agenteUpdate)
}

// DELETE /agentes/:id
function deleteAgente(req, res) {
    const { id } = req.params

    if (!uuidValidate(id)) {
        return res.status(400).json({
            error: 'Id inválido'
        })
    }

    const agenteExists = agentesRepository.getAgenteById(id)
    if (!agenteExists) {
        return res.status(404).json({
            erro: 'Agente não encontrado.'
        })
    }

    agentesRepository.deleteAgente(id)
    res.status(204).send()
}

module.exports = {
    getAllAgentes,
    getAgenteById,
    insertAgente,
    putAgente,
    patchAgente,
    deleteAgente
}