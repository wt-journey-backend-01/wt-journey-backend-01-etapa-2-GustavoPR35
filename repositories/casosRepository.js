const casos = []

function getAll() {
    return casos   
}

function getCasoById(id) {
    const caso = casos.find(c => c.id === id)
    return caso
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

module.exports = {
    getAll,
    getCasoById,
    insertCaso,
    updateCaso,
    deleteCaso
}