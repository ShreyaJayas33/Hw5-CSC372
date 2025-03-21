import express from 'express';
import fetch from 'node-fetch';
import path from 'path';

const app = express();
const PORT = 3002; // Change this to any available port

// Serve static files from the project directory
app.use(express.static(path.resolve('')));

// Serve the index.html file when accessing the root
app.get('/', (req, res) => {
    res.sendFile(path.resolve('index.html'));
});

// Fetch GitHub repos for a given username
app.get('/repos/:username', async (req, res) => {
    const username = req.params.username;
    const apiUrl = `https://api.github.com/users/${username}/repos?per_page=20&sort=updated`;
    const headers = { Authorization: `token YOUR_SECRET_TOKEN` };

    try {
        const response = await fetch(apiUrl, { headers });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
