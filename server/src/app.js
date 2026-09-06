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
// Allowed Origins Array
const allowedOrigins = [
  "http://localhost:5173",
  "https://task-manage-frontend-ecru.vercel.app/",
  process.env.CLIENT_URL,
].filter(Boolean);

// Dynamic CORS Config (Har Vercel Deployment Link Auto-Allow Hoga)
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
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