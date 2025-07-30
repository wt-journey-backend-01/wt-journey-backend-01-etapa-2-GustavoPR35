const agentes = []

function getAll() {
    return agentes
}

function getAgenteById(id) {
    return agentes.find(a => a.id === id)
}

function insertAgente(agente) {
    agentes.push(agente)
    // console.log(agentes) os agentes estão realmente sendo inseridos no array agentes do agentesRepository
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