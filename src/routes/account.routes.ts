/**
 * @swagger
 * tags:
 *   name: 🏦 Contas
 *   description: Gerenciamento de contas bancárias
 */

/**
 * @swagger
 * /accounts:
 *   post:
 *     summary: Criar nova conta bancária
 *     tags: [🏦 Contas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAccount'
 *     responses:
 *       201:
 *         description: Conta criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       409:
 *         description: Limite de contas atingido (máximo 5)
 */

/**
 * @swagger
 * /accounts/{id}/deposit:
 *   post:
 *     summary: Realizar depósito
 *     tags: [💸 Operações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da conta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Deposit'
 *     responses:
 *       200:
 *         description: Depósito realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /accounts/{id}/statement:
 *   get:
 *     summary: Obter extrato da conta
 *     tags: [📊 Extrato]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da conta
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Itens por página
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         description: Data inicial (YYYY-MM-DD)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         description: Data final (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Extrato obtido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedStatement'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

import { Router } from 'express';
import { authenticate, checkAccountOwnership } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import {
  createAccountSchema,
  depositSchema,
  withdrawSchema,
  transferSchema,
  statementSchema,
} from '../schemas/account.schemas';
import accountController from '../controllers/account.controller';

const router = Router();

// Todas as rotas exigem autenticação
router.use(authenticate);

// Rotas de conta
router.post('/', validate(createAccountSchema), accountController.createAccount);
router.get('/', accountController.getUserAccounts);

// Rotas específicas de conta (requerem ownership)
router.get('/:id', checkAccountOwnership, accountController.getAccount);

// Depósito
router.post(
  '/:id/deposit',
  checkAccountOwnership,
  validate(depositSchema),
  accountController.deposit
);

// Saque
router.post(
  '/:id/withdraw',
  checkAccountOwnership,
  validate(withdrawSchema),
  accountController.withdraw
);

// Transferência
router.post(
  '/:id/transfer',
  checkAccountOwnership,
  validate(transferSchema),
  accountController.transfer
);

// Extrato
router.get(
  '/:id/statement',
  checkAccountOwnership,
  validate(statementSchema),
  accountController.getStatement
);

export default router;