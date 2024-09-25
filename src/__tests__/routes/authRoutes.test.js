const request = require('supertest');
const express = require('express');
const authRouter = require('../../routes/authRoutes'); // Importe o arquivo de rotas
const authController = require('../../controllers/authController');

// Mockando as funções do authController
jest.mock('../../controllers/authController');

// Inicializando uma aplicação express para usar nas simulações
const app = express();
app.use(express.json());
app.use('/auth', authRouter); // Usando o router definido

describe('Auth Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Limpar os mocks antes de cada teste
    });

    it('deve chamar registerUser quando POST /auth/register for chamado', async () => {
        authController.registerUser.mockImplementation((req, res) => res.status(201).json({ message: 'User registered successfully' }));

        const response = await request(app)
            .post('/auth/register')
            .send({ name: 'Test User', email: 'test@example.com', password: 'password123' });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User registered successfully');
        expect(authController.registerUser).toHaveBeenCalledTimes(1);
    });

    it('deve chamar loginUser quando POST /auth/login for chamado', async () => {
        authController.loginUser.mockImplementation((req, res) => res.status(200).json({ token: 'fake-token' }));

        const response = await request(app)
            .post('/auth/login')
            .send({ email: 'test@example.com', password: 'password123' });

        expect(response.status).toBe(200);
        expect(response.body.token).toBe('fake-token');
        expect(authController.loginUser).toHaveBeenCalledTimes(1);
    });

    it('deve chamar forgotPassword quando POST /auth/forgot-password for chamado', async () => {
        authController.forgotPassword.mockImplementation((req, res) => res.status(200).json({ message: 'Email sent' }));

        const response = await request(app)
            .post('/auth/forgot-password')
            .send({ email: 'test@example.com' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Email sent');
        expect(authController.forgotPassword).toHaveBeenCalledTimes(1);
    });

    it('deve chamar resetPassword quando POST /auth/reset-password/:token for chamado', async () => {
        authController.resetPassword.mockImplementation((req, res) => res.status(200).json({ message: 'Password reset successfully' }));

        const response = await request(app)
            .post('/auth/reset-password/fake-token')
            .send({ newPassword: 'newPassword123' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Password reset successfully');
        expect(authController.resetPassword).toHaveBeenCalledTimes(1);
    });

    it('deve chamar validateToken quando GET /auth/validate-token/:token for chamado', async () => {
        authController.validateToken.mockImplementation((req, res) => res.status(200).json({ valid: true }));

        const response = await request(app).get('/auth/validate-token/fake-token');

        expect(response.status).toBe(200);
        expect(response.body.valid).toBe(true);
        expect(authController.validateToken).toHaveBeenCalledTimes(1);
    });
});
