const express = require('express');
const app = express();
const PORT = 3000

// Import routes
const aboutUsRoutes = require('./routes/aboutUsRoute');

// Use Routes
app.use('/aboutus', aboutUsRoutes);

// Base Routes
app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>');
})

app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`))
