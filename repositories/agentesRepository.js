const agentes = []

function getAll() {
    return agentes
}

function getAgenteById(id) {
    return agentes.find(a => a.id === id)
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

function getAgentesPorCargo(cargo) {
    return agentes.filter(a => a.cargo.toLowerCase() === cargo.toLowerCase())
}

function getAgentesOrdenadosPorData(sort) {
    const crescente = (sort === 'dataDeIncorporacao')
    const agentesCopy = agentes.slice()
    return agentesCopy.sort((a, b) => {
        const dateA = new Date(a.dataDeIncorporacao).getTime()
        const dateB = new Date(b.dataDeIncorporacao).getTime()
            
        return crescente ? dateA - dateB : dateB - dateA
    })
}

module.exports = {
    getAll,
    getAgenteById,
    insertAgente,
    updateAgente,
    deleteAgente,
    getAgentesPorCargo,
    getAgentesOrdenadosPorData
}