import express from 'express';
import fetch from 'node-fetch';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
const app = express();
app.use(bodyParser.json());
app.use(cors());
dotenv.config();
const DATABRICKS_TOKEN = process.env.DATABRICKS_TOKEN;
// Serve audio file
app.get('/audio/hold_music.mp3', (req, res) => {
  res.sendFile(path.join(__dirname, 'pulic/audio/hold_music.mp3')); // Adjust path to where hold_music.mp3 is stored
});

app.post('/api/databricks-proxy', async (req, res) => {
  try {
    const response = await fetch("https://adb-2240988394477041.1.azuredatabricks.net/serving-endpoints/agents_datalink-lineagedemo-cc_agent/invocations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${DATABRICKS_TOKEN}`,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin":  "*"
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
    console.log("Response from Databricks:", data);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Databricks proxy error" });
  }
});

app.listen(3001, () => console.log('Proxy server running on port 3001'));