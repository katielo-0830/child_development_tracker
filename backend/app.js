import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import therapistRoutes from './routes/therapists.js';
import sessionRoutes from './routes/sessions.js';
import programRoutes from './routes/programs.js';
import stosRoutes from './routes/stos.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/therapists', therapistRoutes); // All routes in therapists.js will be prefixed with /api/therapists
app.use('/api/sessions', sessionRoutes); // All routes in sessions.js will be prefixed with /api/sessions
app.use('/api/programs', programRoutes); // All routes in programs.js will be prefixed with /api/programs
app.use('/api/stos', stosRoutes); // All routes in stos.js will be prefixed with /api/stos

export default app;
