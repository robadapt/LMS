const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

const dataFile = path.join(__dirname, 'tracking_data.txt');

app.post('/track-video', (req, res) => {
    const { email, video } = req.body;
    const timestamp = new Date().toISOString();
    const data = `${email},${video},${timestamp}\n`;
    
    fs.appendFile(dataFile, data, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            res.status(500).send('Error tracking video');
        } else {
            res.status(200).send('Video tracked successfully');
        }
    });
});

app.get('/get-tracking-data', (req, res) => {
    fs.readFile(dataFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).send('Error retrieving tracking data');
        } else {
            const lines = data.trim().split('\n');
            const trackingData = lines.map(line => {
                const [email, video, timestamp] = line.split(',');
                return { email, video, timestamp };
            });
            res.json(trackingData);
        }
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
