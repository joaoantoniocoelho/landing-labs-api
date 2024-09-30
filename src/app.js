/* eslint-disable no-console */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes');

const app = express();

// Lista de origens permitidas
const allowedOrigins = [
    'http://localhost:3000', // para desenvolvimento local
    'https://pageexpress.io',
    'https://dev.pageexpress.io'
];

// Configuração do CORS
app.use(cors({
    origin: function (origin, callback) {
    // Permitir requisições sem origem (como no caso de testes)
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('CORS não permitido para esta origem'));
        }
    }
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

app.get('/', (req, res) => {
    res.send('Page Express API Running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/lead', leadRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
