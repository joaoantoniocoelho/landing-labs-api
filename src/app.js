/* eslint-disable no-console */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(() => console.log('Connected to MongoDB')).catch((error) => console.error('Error connecting on MongoDB:', error));

app.get('/', (req, res) => {
    res.send('Page Express API Running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/lead', leadRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
