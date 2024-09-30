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
    'http://localhost:3000',
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
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Middleware para permitir pré-verificações (OPTIONS)
app.use((req, res, next) => {
    // Verificação adicional para garantir que a requisição venha de uma origem permitida
    const origin = req.headers.origin;
    if (origin && allowedOrigins.indexOf(origin) === -1) {
        return res.status(403).json({ message: 'Acesso negado: origem não permitida' });
    }

    if (req.method === 'OPTIONS') {
        return res.status(200).json({});
    }
    next();
});

// Middleware para validar requests originados apenas do frontend
app.use((req, res, next) => {
    const origin = req.headers.origin || req.headers.referer;

    // Garantir que a origem/referer esteja na lista permitida
    if (origin && allowedOrigins.indexOf(origin) === -1) {
        return res.status(403).json({ message: 'Acesso negado: origem não permitida' });
    }

    next();
});

app.use(express.json());

// Conexão ao MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

// Rota inicial para verificação
app.get('/', (req, res) => {
    res.send('Page Express API Running...');
});

// Rotas de autenticação e leads
app.use('/api/auth', authRoutes);
app.use('/api/lead', leadRoutes);

// Inicialização do servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
