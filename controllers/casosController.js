const casosRepository = require('../repositories/casosRepository')
const agentesRepository = require('../repositories/agentesRepository')
const { v4: uuidv4, validate: uuidValidate } = require('uuid')

// GET /casos
function getAllCasos(req, res) {
    const { agente_id, status } = req.query

    let casos = casosRepository.getAll()

    if (agente_id) {
        if (!uuidValidate(agente_id)) {
            return res.status(400).json({
                error: 'O ID fornecido para o agente é inválido. Certifique-se de usar um UUID válido.'
            })
        }

        casos = casos.filter(c => c.agente_id === agente_id)
    }

    const statusParam = status ? status.trim().toLowerCase() : null
    if (statusParam && statusParam !== 'aberto' && statusParam !== 'solucionado') {
        return res.status(400).json({
            error: 'Status deve ser "aberto" ou "solucionado".'
        })
    } else if (statusParam) {
        casos = casos.filter(c => c.status.toLowerCase() === statusParam.toLowerCase())
    }

    res.status(200).json(casos)
}

// GET /casos/:id
function getCasoById(req, res) {
    const { id } = req.params

    if (!uuidValidate(id)) {
        return res.status(400).json({
            error: 'O ID fornecido para o caso é inválido. Certifique-se de usar um UUID válido.'
        })
    }

    const caso = casosRepository.getCasoById(id)

    if (!caso) {
        return res.status(404).json({
            message: 'Caso não encontrado.'
        })
    }

    res.status(200).json(caso)
}

// GET /casos/:id/agente
function getAgenteByCaso(req, res) {
    const { id } = req.params

    if (!uuidValidate(id)) {
        return res.status(400).json({
            error: 'O ID fornecido para o caso é inválido. Certifique-se de usar um UUID válido.'
        })
    }

    const casoExists = casosRepository.getCasoById(id)

    if (!casoExists) {
        return res.status(404).json({
            message: 'Caso não encontrado.'
        })
    }

    const agente_id = casoExists.agente_id
    const agente = agentesRepository.getAgenteById(agente_id)

    if (!agente) {
        return res.status(404).json({
            message: 'Agente não encontrado.'
        })
    }

    // console.log(agente) // o agente é corretamente retornado
    res.status(200).json(agente)
}

// GET /casos/search
function searchInCaso(req, res) {
    const { q } = req.query

    if (!q || q.trim() === '') {
        return res.status(400).json({
            error: 'O termo de pesquisa "q" é obrigatório.'
        })
    }
    
    const casos = casosRepository.searchCasoTermo(q)

    res.status(200).json(casos)
}

// POST /casos
function insertCaso(req, res) {
    const { titulo, descricao, status, agente_id } = req.body

    if (!titulo || !descricao || !status || !agente_id) {
        return res.status(400).json({
            error: 'Todos os dados são obrigatórios: titulo, descricao, status, agente_id.'
        })
    }

    if (status !== 'aberto' && status !== 'solucionado') {
        return res.status(400).json({
            error: 'Status deve ser "aberto" ou "solucionado".'
        })
    }

    if (!agentesRepository.getAgenteById(agente_id)) {
        return res.status(404).json({
            message: 'Agente não encontrado.'
        })
    }

    const caso = {
        id: uuidv4(), // Gera automaticamente um UUID único
        titulo,
        descricao,
        status,
        agente_id
    }
    casosRepository.insertCaso(caso)
    res.status(201).json(caso)
}

// PUT /casos/:id
function putCaso(req, res) {
    const { id } = req.params
    const { titulo, descricao, status, agente_id } = req.body

    if (req.body.id && req.body.id !== id) {
        return res.status(400).json({ error: 'Não é permitido alterar o campo de ID do caso.' })
    }

    if (!uuidValidate(id)) {
        return res.status(400).json({
            error: 'O ID fornecido para o caso é inválido. Certifique-se de usar um UUID válido.'
        })
    }

    const casoExists = casosRepository.getCasoById(id)
    if (!casoExists) {
        return res.status(404).json({
            message: 'Caso não encontrado.'
        })
    }

    if (!titulo || !descricao || !status || !agente_id) {
        return res.status(400).json({
            error: 'Todos os campos do caso devem ser atualizados: titulo, descricao, status, agente_id.'
        })
    }

    if (status !== 'aberto' && status !== 'solucionado') {
        return res.status(400).json({
            error: 'Status deve ser "aberto" ou "solucionado".'
        })
    }

    if (!agentesRepository.getAgenteById(agente_id)) {
        return res.status(404).json({
            message: 'Agente não encontrado.'
        })
    }

    const casoUpdate = {
        id,
        titulo,
        descricao,
        status,
        agente_id
    }
    casosRepository.updateCaso(casoUpdate)
    res.status(200).json(casoUpdate)
}

// PATCH /casos/:id
function patchCaso(req, res) {
    const { id } = req.params
    const updateData = req.body

    if (!uuidValidate(id)) {
        return res.status(400).json({
            error: 'O ID fornecido para o caso é inválido. Certifique-se de usar um UUID válido.'
        })
    }

    if (updateData.id && updateData.id !== id) {
        return res.status(400).json({ error: 'Não é permitido alterar o campo de ID do caso.' })
    }

    const casoExists = casosRepository.getCasoById(id)
    if (!casoExists) {
        return res.status(404).json({
            message: 'Caso não encontrado.'
        })
    }

    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
            error: 'Pelo menos um campo do caso deve ser atualizado.'
        })
    }

    if (updateData.status && updateData.status !== 'aberto' && updateData.status !== 'solucionado') {
        return res.status(400).json({
            error: 'Status deve ser "aberto" ou "solucionado".'
        })
    }

    if (updateData.agente_id && !agentesRepository.getAgenteById(updateData.agente_id)) {
        return res.status(404).json({
            message: 'Agente não encontrado.'
        })
    }

    const casoUpdate = {
        ...casoExists,
        ...updateData,
        id: id
    }
    casosRepository.updateCaso(casoUpdate)
    res.status(200).json(casoUpdate)
}

// DELETE /casos/:id
function deleteCaso(req, res) {
    const { id } = req.params

    if (!uuidValidate(id)) {
        return res.status(400).json({
            error: 'O ID fornecido para o caso é inválido. Certifique-se de usar um UUID válido.'
        })
    }

    const casoExists = casosRepository.getCasoById(id)
    if (!casoExists) {
        return res.status(404).json({
            message: 'Caso não encontrado.'
        })
    }

    casosRepository.deleteCaso(id)
    res.status(204).send()
}

module.exports = {
    getAllCasos,
    getCasoById,
    insertCaso,
    putCaso,
    patchCaso,
    deleteCaso,
    getAgenteByCaso,
    searchInCaso
}