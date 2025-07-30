const express = require('express')
const router = express.Router()
const casosController = require('../controllers/casosController')

/**
 * @swagger
 * tags:
 *  name: Casos
 *  description: Gerenciamento de casos
 * components:
 *  schemas:
 *      Caso:
 *          type: object
 *          required:
 *              - id
 *              - titulo
 *              - descricao
 *              - status
 *              - agente_id
 *          properties:
 *              id:
 *                  type: string
 *                  readOnly: true
 *                  description: ID único gerado automaticamente
 *              titulo:
 *                  type: string
 *              descricao:
 *                  type: string
 *              status:
 *                  type: string
 *                  enum: [aberto, solucionado]
 *              agente_id:
 *                  type: string
 *      CasoInput:
 *          type: object
 *          required:
 *              - titulo
 *              - descricao
 *              - status
 *              - agente_id
 *          properties:
 *              titulo:
 *                  type: string
 *              descricao:
 *                  type: string
 *              status:
 *                  type: string
 *                  enum: [aberto, solucionado]
 *              agente_id:
 *                  type: string
 */

/**
 * @swagger
 * /casos:
 *   get:
 *     summary: Retorna a lista de todos os casos
 *     tags: [Casos]
 *     responses:
 *       200:
 *         description: Lista de casos retornada com sucesso
 *         content:
 *           application/json:
 *              schema:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Caso'
 */
router.get('/', casosController.getAllCasos)

/**
 * @swagger
 * /casos/search:
 *   get:
 *     summary: Busca casos com termos especificados
 *     tags: [Casos]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Termo de busca
 *     responses:
 *       200:
 *         description: Resultados da busca
 *         content:
 *           application/json:
 *              schema:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Caso'
 *              
 */
router.get('/search', casosController.searchInCaso)

/**
 * @swagger
 * /casos/{id}:
 *   get:
 *     summary: Retorna um caso específico pelo ID
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do caso
 *     responses:
 *       200:
 *         description: Caso encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Caso'
 *       404:
 *         description: Caso não encontrado
 */
router.get('/:id', casosController.getCasoById)

/**
 * @swagger
 * /casos/{id}/agente:
 *   get:
 *     summary: Retorna o agente responsável por um caso
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do caso
 *     responses:
 *       200:
 *         description: Agente responsável pelo caso
 *         content:
 *          aplication/json:
 *              schema:
 *                  $ref: '#/components/schemas/Agente'
 *       404:
 *         description: Caso ou agente não encontrado
 */
router.get('/:id/agente', casosController.getAgenteByCaso)

/**
 * @swagger
 * /casos:
 *   post:
 *     summary: Registra um novo caso
 *     tags: [Casos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CasoInput'
 *     responses:
 *       201:
 *         description: Caso cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Caso'
 *       400:
 *         description: Dados inválidos
 */
router.post('/', casosController.insertCaso)

/**
 * @swagger
 * /casos/{id}:
 *   put:
 *     summary: Atualiza completamente um caso
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do caso
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CasoInput'
 *     responses:
 *       200:
 *         description: Caso atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Caso'
 *       404:
 *         description: Caso não encontrado
 */
router.put('/:id', casosController.putCaso)

/**
 * @swagger
 * /casos/{id}:
 *   patch:
 *     summary: Atualiza parcialmente um caso
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do caso
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CasoInput'
 *     responses:
 *       200:
 *         description: Caso atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Caso'
 *       404:
 *         description: Caso não encontrado
 */
router.patch('/:id', casosController.patchCaso)

/**
 * @swagger
 * /casos/{id}:
 *   delete:
 *     summary: Remove um caso
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do caso
 *     responses:
 *       204:
 *         description: Caso removido com sucesso
 *       404:
 *         description: Caso não encontrado
 */
router.delete('/:id', casosController.deleteCaso)

module.exports = router