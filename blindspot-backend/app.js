const express = require('express');
const cors = require('cors');
const analyzeRoutes = require('./routes/analyzeRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', analyzeRoutes);

app.get('/', (req, res) => {
  res.send('Blindspot Analyzer API is running...');
});

app.use((error, req, res, next) => {
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Send a valid JSON request body.' });
  }
  if (error.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Your request is too large. Shorten your insight and try again.' });
  }
  next(error);
});

module.exports = app;
