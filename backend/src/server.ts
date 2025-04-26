import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { config } from 'dotenv';
import { checkMockoonCli } from './utils/cliChecker';
import { apiKeyAuth } from './middlewares/apiKeyAuth';
import { healthCheckHandler } from './handlers/health/healthCheckHandler';
import { startMockHandler } from './handlers/mock/startMockHandler';
import { stopMockHandler } from './handlers/mock/stopMockHandler';
import { statusMockHandler } from './handlers/mock/statusMockHandler';
import { uploadMockHandler } from './handlers/mock/uploadMockHandler';
import { listConfigsHandler } from './handlers/mock/listConfigsHandler';
import { deleteConfigHandler } from './handlers/mock/deleteConfigHandler';
import { downloadConfigHandler } from './handlers/mock/downloadConfigHandler';
import { ensureDirectoryExists } from './utils/fileUtils';

// Load environment variables
config();

// Create Express app
const app = express();

// Middleware for logging inbound requests with method, URL, timestamp, IP, and body
app.use((req, res, next) => {
  const log = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    ip: req.ip,
    body: req.body, // Logs the request body
  };
  console.log(JSON.stringify(log));
  next();
});

// CORS configuration
const corsOptions: cors.CorsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
};

// Apply middleware
app.use(cors(corsOptions));
app.use(express.json());
app.options('*', cors(corsOptions));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    const uploadDir = path.join(process.cwd(), process.env.UPLOAD_DIR || 'uploads');
    ensureDirectoryExists(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  fileFilter: (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype !== 'application/json' && !file.originalname.endsWith('.json')) {
      return cb(new Error('Only JSON files are allowed'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 50 * 1024 * 1024, // 5MB limit
  },
});

// Ensure required directories exist
ensureDirectoryExists(path.join(process.cwd(), process.env.CONFIGS_DIR || 'configs'));
ensureDirectoryExists(path.join(process.cwd(), process.env.UPLOAD_DIR || 'uploads'));
ensureDirectoryExists(path.join(process.cwd(), process.env.LOGS_DIR || 'logs'));

// Routes
app.get('/api/health', healthCheckHandler);


app.post('/api/auth', (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    res.json({
      success: true,
      message: "Login successful"
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

// Protected routes
app.use('/api/mock', apiKeyAuth);
app.post('/api/mock/start', startMockHandler);
app.post('/api/mock/stop', stopMockHandler);
app.get('/api/mock/status', statusMockHandler);
app.post('/api/mock/upload', upload.single('config'), uploadMockHandler);
app.get('/api/mock/configs', listConfigsHandler);
app.delete('/api/mock/configs/:filename', deleteConfigHandler);
app.get('/api/mock/configs/:filename/download', downloadConfigHandler);

// Start server
const PORT = parseInt(process.env.PORT || '3500', 10);
const HOSTNAME = process.env.HOSTNAME || '0.0.0.0';

async function startServer() {
  try {
    // Check if mockoon-cli is available
    const mockoonCliAvailable = await checkMockoonCli();
    if (!mockoonCliAvailable) {
      console.error('Error: mockoon-cli is not available. Please install it first.');
      process.exit(1);
    }

    app.listen(PORT, HOSTNAME, () => {
      console.log(`Server is running on http://${HOSTNAME}:${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

startServer();
