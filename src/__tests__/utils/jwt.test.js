const jwt = require('jsonwebtoken');
const { generateToken, verifyToken } = require('../../utils/jwt');
const Constants = require('../../constants/constants');
const logger = require('pino')();

jest.mock('jsonwebtoken');
jest.mock('pino', () => {
    return jest.fn(() => ({
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
    }));
});

describe('JWT Utils', () => {

    const userId = '12345';
    const email = 'test@example.com';
    const name = 'Test User';
    const token = 'valid-token';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('generateToken', () => {
        it('deve gerar um token com sucesso', () => {
            jwt.sign.mockReturnValue(token);

            const result = generateToken(userId, email, name);

            expect(jwt.sign).toHaveBeenCalledWith(
                { id: userId, email: email, name: name },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            expect(result).toBe(token);

        });

        it('deve lançar um erro ao falhar na geração do token', () => {
            const errorMessage = 'Token generation failed';
            jwt.sign.mockImplementation(() => {
                throw new Error(errorMessage);
            });

            expect(() => generateToken(userId, email, name)).toThrow(Constants.AUTH.TOKEN_GENERATION_FAILED.MESSAGE);

        });
    });

    describe('verifyToken', () => {
        it('deve verificar o token com sucesso', () => {
            const decodedToken = { id: userId, email: email, name: name };
            jwt.verify.mockReturnValue(decodedToken);

            const result = verifyToken(token);

            expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);

            expect(result).toEqual(decodedToken);

        });

        it('deve retornar null e logar um aviso se o token for inválido', () => {
            const errorMessage = 'Token is invalid';
            jwt.verify.mockImplementation(() => {
                throw new Error(errorMessage);
            });

            const result = verifyToken(token);

            expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);

            expect(result).toBeNull();

        });
    });
});
