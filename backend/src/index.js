import express from 'express';
import path from 'path';

import authRouter from './routes/auth.js';
import ofertasRouter from './routes/ofertas.js';
import postulacionesRouter from './routes/postulaciones.js';
import candidatoRouter from './routes/candidato.js';
import empresaRouter from './routes/empresa.js';
import adminRouter from './routes/admin.js';
import valoracionesRouter from './routes/valoraciones.js';

import { errorHandler, notFound } from './middlewares/errorHandler.js';

import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(express.json());

app.use(express.static(path.join(import.meta.dirname, '../../frontend')));

app.use('/api/auth', authRouter);
app.use('/api/ofertas', ofertasRouter);
app.use('/api/postulaciones', postulacionesRouter);
app.use('/api/candidato', candidatoRouter);
app.use('/api/empresa', empresaRouter);
app.use('/api/admin', adminRouter);
app.use('/api/valoraciones', valoracionesRouter);

app.use(notFound);

app.use(errorHandler);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Servidor corriendo en http://localhost:${process.env.PORT || 3000}`);
});
