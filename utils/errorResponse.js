/**
 * Cria uma resposta de erro padronizada
 * @param {number} status - Código de status HTTP
 * @param {string} message - Mensagem de erro geral
 * @param {object} errors - Objeto com erros específicos por campo
 * @returns {object} Objeto de resposta de erro formatado
 */
function createErrorResponse(status, message, errors = {}) {
    return {
        status,
        message,
        errors
    }
}

/**
 * Cria resposta de erro para validação de campos
 * @param {object} fieldErrors - Objeto com erros por campo
 * @returns {object} Resposta de erro formatada
 */
function createValidationError(fieldErrors) {
    return createErrorResponse(400, "Parâmetros inválidos", fieldErrors)
}

/**
 * Cria resposta de erro para recurso não encontrado
 * @param {string} resource - Nome do recurso não encontrado
 * @returns {object} Resposta de erro formatada
 */
function createNotFoundError(resource = "Recurso") {
    return createErrorResponse(404, `${resource} não encontrado`, {})
}

module.exports = {
    createErrorResponse,
    createValidationError,
    createNotFoundError
}
