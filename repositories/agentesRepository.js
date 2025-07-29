const agentes = []

function getAll() {
    return agentes
}

function getAgenteById(id) {
    const agente = agentes.find(a => a.id === id)
    return agente
}

function insertAgente(agente) {
    agentes.push(agente)
}

function updateAgente(agenteUpdate) {
    const agenteIndex = agentes.findIndex(a => a.id === agenteUpdate.id)
    if (agenteIndex !== -1) {
        agentes[agenteIndex] = agenteUpdate
    }
}

function deleteAgente(id) {
    const agenteIndex = agentes.findIndex(a => a.id === id)
    if (agenteIndex !== -1) {
        agentes.splice(agenteIndex, 1)
    }
}

module.exports = {
    getAll,
    getAgenteById,
    insertAgente,
    updateAgente,
    deleteAgente
}