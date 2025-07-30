const casos = []

function getAll() {
    return casos   
}

function getCasoById(id) {
    return casos.find(c => c.id === id)
}

function insertCaso(caso) {
    casos.push(caso)
}

function updateCaso(caso) {
    const casoIndex = casos.findIndex(c => c.id === caso.id)
    if (casoIndex !== -1) {
        casos[casoIndex] = caso
    }
}

function deleteCaso(id) {
    const casoIndex = casos.findIndex(c => c.id === id)
    if (casoIndex !== -1) {
        casos.splice(casoIndex, 1)
    }
}

function getCasosByAgente(id) {
    return casos.filter(c => c.agente_id === id)
}

function searchCasoTermo(q) {
    const query = q.toLowerCase()
    return casos.filter(c => {
        return c.titulo.toLowerCase().includes(query) || c.descricao.toLowerCase().includes(query)
    })
}

function searchCasoStatus(status) {
    return casos.filter(c => c.status.toLowerCase() === status.toLowerCase())
}

module.exports = {
    getAll,
    getCasoById,
    insertCaso,
    updateCaso,
    deleteCaso,
    getCasosByAgente,
    searchCasoTermo,
    searchCasoStatus
}