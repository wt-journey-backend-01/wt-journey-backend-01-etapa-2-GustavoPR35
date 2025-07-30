const agentesRepository = require('../repositories/agentesRepository')
const { v4: uuidv4, validate: uuidValidate } = require('uuid')

// GET /agentes
function getAllAgentes(req, res) {
    const { cargo, sort } = req.query
    let agentes = agentesRepository.getAll()

    const sortParam = sort ? sort.trim().toLowerCase() : null
    if (sortParam && sortParam !== 'datadeincorporacao' && sortParam !== '-datadeincorporacao') {
        return res.status(400).json({ erro: 'Parâmetro sort deve ser "dataDeIncorporacao" ou "-dataDeIncorporacao"' })
    }

    if (cargo) {
        agentes = agentes.filter(a => a.cargo.toLowerCase() === cargo.toLowerCase())
    }

    if (sortParam === 'dataDeIncorporacao' || sortParam === '-dataDeIncorporacao') {
        const agentesCopy = agentes.slice()
        agentesCopy.sort((a, b) => {
            const dateA = new Date(a.dataDeIncorporacao).getTime()
            const dateB = new Date(b.dataDeIncorporacao).getTime()
            return sortParam === 'dataDeIncorporacao' ? dateA - dateB : dateB - dateA
        })
        agentes = agentesCopy
    }

    res.status(200).json(agentes)
}

// GET /agentes/:id
function getAgenteById(req, res) {
    const { id } = req.params

    // Validar UUID primeiro
    if (!uuidValidate(id)) {
        return res.status(400).json({
            erro: 'O ID fornecido para o agente é inválido. Certifique-se de usar um UUID válido.'
        })
    }

    // Buscar agente
    const agente = agentesRepository.getAgenteById(id)
    if (!agente) {
        return res.status(404).json({
            erro: 'Agente não encontrado.'
        })
    }

    res.status(200).json(agente)
}

// POST /agentes
function insertAgente(req, res) {
    const { nome, dataDeIncorporacao, cargo } = req.body

    if (!nome || !dataDeIncorporacao || !cargo) {
        return res.status(400).json({
            erro: 'Todos os dados são obrigatórios: nome, dataDeIncorporacao, cargo.'
        })
    }

    const dataRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dataRegex.test(dataDeIncorporacao)) {
        return res.status(400).json({ erro: 'O campo dataDeIncorporacao deve estar no formato YYYY-MM-DD.' })
    }
    const dataIncorp = new Date(dataDeIncorporacao)
    const hoje = new Date()
    if (dataIncorp > hoje) {
        return res.status(400).json({ erro: 'O campo dataDeIncorporacao não pode ser uma data futura.' })
    }

    const agente = {
        id: uuidv4(), // Gera automaticamente um UUID único
        nome,
        dataDeIncorporacao,
        cargo
    }
    agentesRepository.insertAgente(agente) // os agentes estão realmente sendo inseridos no array agentes do agentesRepository
    res.status(201).json(agente)
}

// PUT /agentes/:id
function putAgente(req, res) {
    const { id } = req.params
    const { nome, dataDeIncorporacao, cargo } = req.body

    if (req.body.id && req.body.id !== id) {
        return res.status(400).json({ erro: 'Não é permitido alterar o campo de ID do agente.' })
    }

    if (!uuidValidate(id)) {
        return res.status(400).json({
            erro: 'O ID fornecido para o agente é inválido. Certifique-se de usar um UUID válido.'
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
            erro: 'Todos os campos do agente devem ser atualizados: nome, dataDeIncorporacao, cargo.'
        })
    }

    const dataRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dataRegex.test(dataDeIncorporacao)) {
        return res.status(400).json({ erro: 'O campo dataDeIncorporacao deve estar no formato YYYY-MM-DD.' })
    }
    const dataIncorp = new Date(dataDeIncorporacao)
    const hoje = new Date()
    if (dataIncorp > hoje) {
        return res.status(400).json({ erro: 'dataDeIncorporacao não pode ser uma data futura' })
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
            erro: 'O ID fornecido para o agente é inválido. Certifique-se de usar um UUID válido.'
        })
    }

    if (updateData.id && updateData.id !== id) {
        return res.status(400).json({ erro: 'Não é permitido alterar o campo id.' })
    }

    const agenteExists = agentesRepository.getAgenteById(id)
    if (!agenteExists) {
        return res.status(404).json({
            erro: 'Agente não encontrado.'
        })
    }

    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
            erro: 'Pelo menos um campo do agente deve ser atualizado.'
        })
    }

    if (updateData.dataDeIncorporacao) {
        const dataRegex = /^\d{4}-\d{2}-\d{2}$/
        if (!dataRegex.test(updateData.dataDeIncorporacao)) {
            return res.status(400).json({ erro: 'O campo dataDeIncorporacao deve estar no formato YYYY-MM-DD.' })
        }
        const dataIncorp = new Date(updateData.dataDeIncorporacao)
        const hoje = new Date()
        if (dataIncorp > hoje) {
            return res.status(400).json({ erro: 'O campo dataDeIncorporacao não pode ser uma data futura.' })
        }
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
            erro: 'O ID fornecido para o agente é inválido. Certifique-se de usar um UUID válido.'
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