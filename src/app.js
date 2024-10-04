/* eslint-disable no-console */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes');
const pageRoutes = require('./routes/pageRoutes');

const app = express();

const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://pageexpress.io',
    'https://dev.pageexpress.io'
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('CORS não permitido para esta origem'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.indexOf(origin) === -1) {
        return res.status(403).json({ message: 'Acesso negado: origem não permitida' });
    }

    if (req.method === 'OPTIONS') {
        return res.status(200).json({});
    }
    next();
});

app.use((req, res, next) => {
    const origin = req.headers.origin || req.headers.referer;
    if (origin && allowedOrigins.indexOf(origin) === -1) {
        return res.status(403).json({ message: 'Acesso negado: origem não permitida' });
    }
    next();
});

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado ao MongoDB'))
    .catch((error) => console.error('Erro ao conectar ao MongoDB:', error));

app.get('/', (req, res) => {
    res.send('Page Express API Running...');
});

app.get('/ping', (req, res) => {
    res.status(200).json({
        message: 'pong!'
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/lead', leadRoutes);
app.use('/api/pages', pageRoutes);

// Inicialização do servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
