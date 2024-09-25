const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const { registerUser, loginUser, forgotPassword, resetPassword, validateToken } = require('../../controllers/authController');
const Constants = require('../../constants/constants');
const { generateToken } = require('../../utils/jwt');
const { sendEmail } = require('../../utils/emailUtils');
const userSchema = require('../../schemas/userSchema');

jest.mock('pino', () => {
    return jest.fn(() => ({
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
    }));
});

jest.mock('../../models/User');
jest.mock('bcrypt');
jest.mock('../../utils/jwt');
jest.mock('jsonwebtoken');
jest.mock('../../utils/emailUtils');
jest.mock('../../schemas/userSchema');

describe('Auth Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                email: 'test@example.com',
                password: 'test1234',
                name: 'Test User',
                newPassword: 'newPassword123'
            },
            params: {
                token: 'validToken'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks();
    });

    describe('registerUser', () => {
        it('deve registrar um novo usuário com sucesso', async () => {
            userSchema.validate.mockReturnValue({ error: null });

            User.findOne.mockResolvedValue(null);

            bcrypt.genSalt.mockResolvedValue('test-salt');
            bcrypt.hash.mockResolvedValue('hashed-password');

            User.prototype.save = jest.fn().mockResolvedValue();

            await registerUser(req, res);

            expect(userSchema.validate).toHaveBeenCalledWith(req.body);
            expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
            expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
            expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, 'test-salt');
            expect(User.prototype.save).toHaveBeenCalled();

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                code: Constants.USER.CREATED.CODE,
                message: Constants.USER.CREATED.MESSAGE
            });
        });

        it('deve retornar erro de validação se o corpo da requisição for inválido', async () => {
            userSchema.validate.mockReturnValue({
                error: { details: [{ message: 'Invalid input' }] }
            });

            await registerUser(req, res);

            expect(userSchema.validate).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                code: Constants.VALIDATION.FAILED.CODE,
                message: `${Constants.VALIDATION.FAILED.MESSAGE}Invalid input`
            });
        });

        it('deve retornar erro se o usuário já estiver registrado', async () => {
            userSchema.validate.mockReturnValue({ error: null });
            User.findOne.mockResolvedValue({ email: req.body.email });

            await registerUser(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                code: Constants.USER.ALREADY_EXISTS.CODE,
                message: Constants.USER.ALREADY_EXISTS.MESSAGE
            });
        });

        it('deve retornar erro de servidor em caso de falha', async () => {
            userSchema.validate.mockReturnValue({ error: null });
            User.findOne.mockRejectedValue(new Error('Database error'));

            await registerUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                code: Constants.ERROR.SERVER_ERROR.CODE,
                message: Constants.ERROR.SERVER_ERROR.MESSAGE
            });
        });
    });

    describe('loginUser', () => {
        it('deve retornar token para login bem-sucedido', async () => {
            const mockUser = {
                _id: 'userId',
                email: 'test@example.com',
                password: 'hashedPassword',
                name: 'Test User'
            };

            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            generateToken.mockReturnValue('mockToken');

            await loginUser(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
            expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, mockUser.password);
            expect(generateToken).toHaveBeenCalledWith(mockUser._id, mockUser.email, mockUser.name);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                token: 'mockToken',
                code: Constants.USER.LOGIN_SUCCESSFUL.CODE,
                message: Constants.USER.LOGIN_SUCCESSFUL.MESSAGE
            });
        });

        it('deve retornar erro se o usuário não for encontrado', async () => {
            User.findOne.mockResolvedValue(null);

            await loginUser(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                code: Constants.AUTH.INVALID_EMAIL_OR_PASSWORD.CODE,
                message: Constants.AUTH.INVALID_EMAIL_OR_PASSWORD.MESSAGE
            });
        });

        it('deve retornar erro se a senha for inválida', async () => {
            const mockUser = {
                _id: 'userId',
                email: 'test@example.com',
                password: 'hashedPassword',
                name: 'Test User'
            };

            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);

            await loginUser(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
            expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, mockUser.password);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                code: Constants.AUTH.INVALID_EMAIL_OR_PASSWORD.CODE,
                message: Constants.AUTH.INVALID_EMAIL_OR_PASSWORD.MESSAGE
            });
        });

        it('deve retornar erro de servidor se ocorrer um erro', async () => {
            User.findOne.mockRejectedValue(new Error('Database error'));

            await loginUser(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                code: Constants.ERROR.SERVER_ERROR.CODE,
                message: Constants.ERROR.SERVER_ERROR.MESSAGE
            });
        });
    });

    describe('forgotPassword', () => {
        it('deve enviar um e-mail de redefinição de senha com sucesso', async () => {
            const mockUser = { _id: 'userId', email: 'test@example.com' };
            User.findOne.mockResolvedValue(mockUser);
            jwt.sign.mockReturnValue('resetToken');

            await forgotPassword(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
            expect(jwt.sign).toHaveBeenCalledWith({ id: mockUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            expect(sendEmail).toHaveBeenCalledWith({
                to: mockUser.email,
                subject: 'Redefinição de Senha',
                html: expect.any(String) 
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                code: Constants.USER.PASSWORD_RESET_EMAIL_SENT.CODE,
                message: Constants.USER.PASSWORD_RESET_EMAIL_SENT.MESSAGE
            });
        });

        it('deve retornar erro se o usuário não for encontrado', async () => {
            User.findOne.mockResolvedValue(null);

            await forgotPassword(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                code: Constants.USER.NOT_FOUND.CODE,
                message: Constants.USER.NOT_FOUND.MESSAGE
            });
        });

        it('deve retornar erro de servidor se ocorrer um erro', async () => {
            User.findOne.mockRejectedValue(new Error('Database error'));

            await forgotPassword(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                code: Constants.ERROR.EMAIL_SEND_ERROR.CODE,
                message: Constants.ERROR.EMAIL_SEND_ERROR.MESSAGE
            });
        });
    });

    describe('resetPassword', () => {
        it('deve redefinir a senha com sucesso', async () => {
            const mockUser = { _id: 'userId', email: 'test@example.com', save: jest.fn() };
            jwt.verify.mockReturnValue({ id: mockUser._id });
            User.findById.mockResolvedValue(mockUser);
            bcrypt.genSalt.mockResolvedValue('salt');
            bcrypt.hash.mockResolvedValue('hashedPassword');

            await resetPassword(req, res);

            expect(jwt.verify).toHaveBeenCalledWith(req.params.token, process.env.JWT_SECRET);
            expect(User.findById).toHaveBeenCalledWith(mockUser._id);
            expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
            expect(bcrypt.hash).toHaveBeenCalledWith(req.body.newPassword, 'salt');
            expect(mockUser.save).toHaveBeenCalled();

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                code: Constants.USER.PASSWORD_RESET_SUCCESSFUL.CODE,
                message: Constants.USER.PASSWORD_RESET_SUCCESSFUL.MESSAGE
            });
        });

        it('deve retornar erro se o token for inválido', async () => {
            jwt.verify.mockImplementation(() => { throw new Error('Invalid token') });

            await resetPassword(req, res);

            expect(jwt.verify).toHaveBeenCalledWith(req.params.token, process.env.JWT_SECRET);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                code: Constants.AUTH.TOKEN_INVALID.CODE,
                message: Constants.AUTH.TOKEN_INVALID.MESSAGE
            });
        });

        it('deve retornar erro se o usuário não for encontrado', async () => {
            jwt.verify.mockReturnValue({ id: 'userId' });
            User.findById.mockResolvedValue(null);

            await resetPassword(req, res);

            expect(User.findById).toHaveBeenCalledWith('userId');
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                code: Constants.USER.NOT_FOUND.CODE,
                message: Constants.USER.NOT_FOUND.MESSAGE
            });
        });
    });

    describe('validateToken', () => {
        it('deve validar um token com sucesso', async () => {
            jwt.verify.mockReturnValue({ id: 'userId' });

            await validateToken(req, res);

            expect(jwt.verify).toHaveBeenCalledWith(req.params.token, process.env.JWT_SECRET);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                code: Constants.AUTH.TOKEN_VALID.CODE,
                message: Constants.AUTH.TOKEN_VALID.MESSAGE
            });
        });

        it('deve retornar erro se o token for inválido', async () => {
            jwt.verify.mockImplementation(() => { throw new Error('Invalid token') });

            await validateToken(req, res);

            expect(jwt.verify).toHaveBeenCalledWith(req.params.token, process.env.JWT_SECRET);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                code: Constants.AUTH.TOKEN_VERIFICATION_FAILED.CODE,
                message: Constants.AUTH.TOKEN_VERIFICATION_FAILED.MESSAGE
            });
        });

        it('deve retornar erro se o token não for fornecido', async () => {
            req.params.token = null;

            await validateToken(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                code: Constants.AUTH.NO_TOKEN.CODE,
                message: Constants.AUTH.NO_TOKEN.MESSAGE
            });
        });
    });
});
