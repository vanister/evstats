import express from 'express';
import cors from 'cors';
import { mkdirSync, existsSync } from 'fs';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const filepath = fileURLToPath(import.meta.url);
const dirname = path.dirname(filepath);
const app = express();

const LOG_DIR = path.join(dirname, '..', 'logs');
const PORT = 4000;

console.log('Log output written to:', LOG_DIR);

if (!existsSync(LOG_DIR)) {
  mkdirSync(LOG_DIR, { recursive: true });
}

app.use(express.json());
app.use(cors());

app.post('/log', async (req, res) => {
  try {
    console.log('Log request', req.body);

    const { level, message, stack } = req.body;

    if (!level || !message) {
      return res.status(400).json({ error: 'Level and message are required' });
    }

    if (level === 'error' && !stack) {
      return res.status(400).json({ error: 'Stack trace required for error level' });
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      stack: level === 'error' ? stack : undefined
    };

    const logFilePath = path.join(LOG_DIR, `${level}.log`);
    await fs.appendFile(logFilePath, JSON.stringify(logEntry) + '\n');

    return res.sendStatus(200);
  } catch (error) {
    console.error('Error writing log:', error);
    res.status(500).json({ error: 'Failed to write log' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
