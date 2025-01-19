const express = require('express');
const dotenv = require('dotenv');
const characterRoutes = require('./routes/characters');
const combatRoutes = require('./routes/combat');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//Middleware
app.use(express.json());

//Routes
app.use('/api/characters', characterRoutes);

//Combat routes 
app.use('/api/combats', combatRoutes);

//Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});