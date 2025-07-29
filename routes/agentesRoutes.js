const express = require('express')
const router = express.Router()
const agentesController = require('../controllers/agentesControllers')

/**
 * @swagger
 * tags:
 *  name: Agentes
 *  description: Gerenciamento de agentes
 * components:
 *   schemas:
 *     Agente:
 *       type: object
 *       required:
 *         - id
 *         - nome
 *         - dataDeIncorporacao
 *         - cargo
 *       properties:
 *         id:
 *           type: string
 *         nome:
 *           type: string
 *         dataDeIncorporacao:
 *           type: string
 *         cargo:
 *           type: string
 * 
 */

/**
 * @swagger
 * /agentes:
 *   get:
 *     summary: Retorna a lista de todos os agentes
 *     tags: [Agentes]
 *     responses:
 *       200:
 *         description: Lista de agentes retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Agente'
 */
router.get('/agentes', agentesController.getAllAgentes)

/**
 * @swagger
 * /agentes/{id}:
 *   get:
 *     summary: Retorna um agente específico pelo ID
 *     tags: [Agentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do agente
 *     responses:
 *       200:
 *         description: Agente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agente'
 *       404:
 *         description: Agente não encontrado
 */
router.get('/agentes/:id', agentesController.getAgenteById)

/**
 * @swagger
 * /agentes:
 *   post:
 *     summary: Cadastra um novo agente
 *     tags: [Agentes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Agente'
 *     responses:
 *       201:
 *         description: Agente cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agente'
 *       400:
 *         description: Dados inválidos
 */
router.post('/agentes', agentesController.insertAgente)

/**
 * @swagger
 * /agentes/{id}:
 *   put:
 *     summary: Atualiza completamente um agente
 *     tags: [Agentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do agente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Agente'
 *     responses:
 *       200:
 *         description: Agente atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agente'
 *       404:
 *         description: Agente não encontrado
 */
router.put('/agentes/:id', agentesController.putAgente)

/**
 * @swagger
 * /agentes/{id}:
 *   patch:
 *     summary: Atualiza parcialmente um agente
 *     tags: [Agentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do agente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Agente'
 *     responses:
 *       200:
 *         description: Agente atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agente'
 *       404:
 *         description: Agente não encontrado
 */
router.patch('/agentes/:id', agentesController.patchAgente)

/**
 * @swagger
 * /agentes/{id}:
 *   delete:
 *     summary: Remove um agente
 *     tags: [Agentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do agente
 *     responses:
 *       200:
 *         description: Agente removido com sucesso
 *       404:
 *         description: Agente não encontrado
 */
router.delete('/agentes/:id', agentesController.deleteAgente)

module.exports = router
