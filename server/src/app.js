import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import workspaceRoutes from './routes/workspaceRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { notFound, errorHandler } from './middleware/error.js';

const app = express();

// Connect DB for serverless environment
connectDB().catch(err => console.error('[server] DB connection failed:', err.message));

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'https://task-manage-frontend-ecru.vercel.app/',
    credentials: true,
  })
);



app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/workspaces', workspaceRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.send('API is running successfully');
});

app.use(notFound);
app.use(errorHandler);

export default app;