/**
 * @swagger
 * tags:
 *   name: 🩺 Saúde
 *   description: Verificação do status do sistema
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check do sistema
 *     tags: [🩺 Saúde]
 *     responses:
 *       200:
 *         description: Sistema funcionando
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 database:
 *                   type: string
 *                   example: connected
 *                 uptime:
 *                   type: number
 *                   example: 123.45
 *       500:
 *         description: Sistema com problemas
 */

import { Router } from 'express';
import prisma from '../config/database';

const router = Router();

router.get('/', async (req, res) => {
  try {
    // Verificar conexão com o banco de dados
    await prisma.$queryRaw`SELECT 1`;
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      uptime: process.uptime(),
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: 'Database connection failed',
    });
  }
});

router.get('/version', (req, res) => {
  res.json({
    name: 'Banking API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

export default router;