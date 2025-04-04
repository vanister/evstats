import express from 'express';
import cors from 'cors';
import { mkdirSync, existsSync } from 'fs';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const filepath = fileURLToPath(import.meta.url);
const dirname = path.dirname(filepath);
const today = new Date().toISOString().split('T')[0];
const LOG_DIR = path.join(dirname, '..', 'logs');
const PORT = 4000;

console.log('Log output written to:', LOG_DIR);

if (!existsSync(LOG_DIR)) {
  mkdirSync(LOG_DIR, { recursive: true });
}

const app = express();
app.use(express.json());
app.use(cors());

app.post('/log', async (req, res) => {
  try {
    console.log('Log request', req.body);

    const { level, message, stack } = req.body;

    if (!level || !message) {
      return res.status(400).json({ error: 'Level and message are required' });
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      stack
    };

    const logFilePath = path.join(LOG_DIR, `${today}.log`);
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
