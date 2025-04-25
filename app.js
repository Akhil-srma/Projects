const express = require('express');
const cors = require('cors'); // <-- Add this
const app = express();
const path = require('path');
const router = require('./Router/router');

const PORT = 3000;

// ✅ Enable CORS for all routes
app.use(cors());

// Parse form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Use router
app.use('/', router);

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
