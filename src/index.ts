import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { errorHandler } from './middlewares/errorHandler';
import { notFoundHandler } from './middlewares/notFoundHandler';
import { requestLogger } from './middlewares/logger';
import authRoutes from './routes/auth.routes';
import accountRoutes from './routes/account.routes';
import healthRoutes from './routes/health.routes';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerOptions from './config/swagger';

const app = express();

// ========== SWAGGER DOCUMENTATION ==========
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info { margin: 20px 0; }
    .swagger-ui .scheme-container { background: #fafafa; }
    .opblock-tag { font-size: 18px; }
    .try-out { display: none; }
  `,
  customSiteTitle: 'Banking API Documentation',
  swaggerOptions: {
    persistAuthorization: true,
    docExpansion: 'list',
    filter: true,
  },
}));

// Rota raiz redireciona para documentação
app.get('/', (req, res) => {
  res.redirect('/api/v1/docs');
});

app.get('/docs', (req, res) => {
  res.redirect('/api/v1/docs');
});

// Middlewares básicos
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Rotas
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/accounts', accountRoutes);
app.use('/api/v1/health', healthRoutes);

// Documentação (será implementada depois)
app.get('/api/v1/docs', (req, res) => {
  res.json({ message: 'Documentação disponível em breve' });
});

// Rotas não encontradas
app.use(notFoundHandler);

// Manipulador de erros global
app.use(errorHandler);

// Iniciar servidor
const PORT = env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📝 Ambiente: ${env.NODE_ENV}`);
  console.log(`🔗 URL: ${env.APP_URL}`);
});

export default app;