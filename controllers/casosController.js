const casosRepository = require('../repositories/casosRepository')
const agentesRepository = require('../repositories/agentesRepository')
const { v4: uuidv4, validate: uuidValidate } = require('uuid')

// GET /casos
function getAllCasos(req, res) {
    const { agente_id, status } = req.query

    let casos = casosRepository.getAll()

    if (casos.length === 0) {
        return res.status(200).json({
            mensagem: 'Não há nenhum caso cadastrado.'
        })
    }

    if (agente_id) {
        if (!uuidValidate(agente_id)) {
            return res.status(400).json({
                error: 'Id inválido'
            })
        }

        casos = casos.filter(c => c.agente_id === agente_id)
        if (casos.length === 0) {
            return res.status(200).json({
                mensagem: 'Nenhum caso com o agente especificado encontrado.'
            })
        }
    }

    if (status && status !== 'aberto' && status !== 'solucionado') {
        return res.status(400).json({
            erro: 'status deve ser "aberto" ou "solucionado".'
        })
    } else if (status) {
        casos = casos.filter(c => c.status === status)
        if (casos.length === 0) {
            return res.status(200).json({
                mensagem: `Nenhum caso ${status} encontrado.`
            })
        }
    }

    res.status(200).json(casos)
}

// GET /casos/:id
function getCasoById(req, res) {
    const { id } = req.params
    const caso = casosRepository.getCasoById(id)

    if (!uuidValidate(id)) {
        return res.status(400).json({
            error: 'Id inválido'
        })
    }

    if (!caso) {
        return res.status(404).json({
            erro: 'Caso não encontrado'
        })
    }

    res.status(200).json(caso)
}

// GET /casos/:id/agente
function getAgenteByCaso(req, res) {
    const { id } = req.params
    const casoExists = casosRepository.getCasoById(id)

    if (!uuidValidate(id)) {
        return res.status(400).json({
            error: 'Id inválido'
        })
    }

    if (!casoExists) {
        return res.status(404).json({
            erro: 'Caso não encontrado'
        })
    }

    const agente = agentesRepository.getAgenteById(casoExists.agente_id)
    res.status(200).json(agente)
}

// GET /casos/search
function searchInCaso(req, res) {
    const { q } = req.query
    
    if (!q || q.trim() === '') {
        return res.status(400).json({
            erro: 'Termo de busca "q" é obrigatório.'
        })
    }
    
    const searchQuery = q.toLowerCase().trim()
    let casos = casosRepository.getAll()

    casos = casos.filter(c => 
        c.titulo.toLowerCase().includes(searchQuery) || 
        c.descricao.toLowerCase().includes(searchQuery)
    )
    
    if (casos.length === 0) {
        return res.status(200).json({
            mensagem: 'Nenhum caso encontrado pela pesquisa.'
        })
    }

    res.status(200).json(casos)
}

// POST /casos
function insertCaso(req, res) {
    const { titulo, descricao, status, agente_id } = req.body

    if (!titulo || !descricao || !status || !agente_id) {
        return res.status(400).json({
            erro: 'Todos os dados são obrigatórios: titulo, descricao, status, agente_id'
        })
    }

    if (status !== 'aberto' && status !== 'solucionado') {
        return res.status(400).json({
            erro: 'status deve ser "aberto" ou "solucionado".'
        })
    }

    if (!agentesRepository.getAgenteById(agente_id)) {
        return res.status(404).json({
            erro: 'Agente não encontrado.'
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
    // console.log('caso inserido: ', caso.id)
    res.status(201).json(caso)
}

// PUT /casos/:id
function putCaso(req, res) {
    const { id } = req.params
    const { titulo, descricao, status, agente_id } = req.body

    if (!uuidValidate(id)) {
        return res.status(400).json({
            error: 'Id inválido'
        })
    }

    const casoExists = casosRepository.getCasoById(id)
    if (!casoExists) {
        return res.status(404).json({
            erro: 'Caso não encontrado.'
        })
    }

    if (!titulo || !descricao || !status || !agente_id) {
        return res.status(400).json({
            erro: 'Todos os campos devem ser atualizados: titulo, descricao, status, agente_id'
        })
    }

    if (status !== 'aberto' && status !== 'solucionado') {
        return res.status(400).json({
            erro: 'status deve ser "aberto" ou "solucionado".'
        })
    }

    if (!agentesRepository.getAgenteById(agente_id)) {
        return res.status(404).json({
            erro: 'Agente não encontrado.'
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
            error: 'Id inválido'
        })
    }

    const casoExists = casosRepository.getCasoById(id)
    if (!casoExists) {
        return res.status(404).json({
            erro: 'Caso não encontrado.'
        })
    }

    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
            erro: 'Pelo menos um campo deve ser atualizado.'
        })
    }

    if (updateData.status && updateData.status !== 'aberto' && updateData.status !== 'solucionado') {
        return res.status(400).json({
            erro: 'status deve ser "aberto" ou "solucionado".'
        })
    }

    if (updateData.agente_id && !agentesRepository.getAgenteById(updateData.agente_id)) {
        return res.status(404).json({
            erro: 'Agente não encontrado.'
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
            error: 'Id inválido'
        })
    }

    const casoExists = casosRepository.getCasoById(id)
    if (!casoExists) {
        return res.status(404).json({
            erro: 'Caso não encontrado.'
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