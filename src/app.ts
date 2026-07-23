import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

// Standard middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Welcome Route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Bienvenido a la API del Sistema de Gestión Veterinaria',
    data: {
      version: '1.0.0',
      status: 'Servidor Operativo'
    }
  });
});

// API Routes
app.use('/api', routes);

// Global Error Handler
app.use(errorHandler);

export default app;
