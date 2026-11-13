import express from 'express';
import path from 'path';

import authRouter from './routes/auth.js';

import { errorHandler, notFound } from './middlewares/errorHandler.js';

import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(express.json());

app.use(express.static(path.join(import.meta.dirname, '../../frontend')));

app.use('/api/auth', authRouter);

app.use(notFound);

app.use(errorHandler);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Servidor corriendo en http://localhost:${process.env.PORT || 3000}`);
});
