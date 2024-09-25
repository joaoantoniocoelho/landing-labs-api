const { verifyToken } = require('../../utils/jwt');
const User = require('../../models/User');
const authMiddleware = require('../../middleware/auth.middleware');
const Constants = require('../../constants/constants');

// Mockando dependências
jest.mock('../../utils/jwt');
jest.mock('../../models/User');

describe('authMiddleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            headers: {
                authorization: 'Bearer valid-token',
            },
        };
        res = {
            status: jest.fn(() => res),
            json: jest.fn(() => res),
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    it('deve retornar 401 se o token não for fornecido', async () => {
        req.headers.authorization = null;

        await authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            code: Constants.AUTH.NO_TOKEN.CODE,
            message: Constants.AUTH.NO_TOKEN.MESSAGE,
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar 401 se o token for inválido', async () => {
        verifyToken.mockReturnValue(null);

        await authMiddleware(req, res, next);

        expect(verifyToken).toHaveBeenCalledWith('valid-token');
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            code: Constants.AUTH.TOKEN_INVALID.CODE,
            message: Constants.AUTH.TOKEN_INVALID.MESSAGE,
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar 401 se o usuário não for encontrado', async () => {
        verifyToken.mockReturnValue({ id: 'userId' });
        User.findById.mockResolvedValue(null);

        await authMiddleware(req, res, next);

        expect(User.findById).toHaveBeenCalledWith('userId');
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            code: Constants.USER.NOT_FOUND.CODE,
            message: Constants.USER.NOT_FOUND.MESSAGE,
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar 401 se o token foi emitido antes da última alteração de senha', async () => {
        const lastPasswordChange = new Date();
        const tokenIssuedAt = new Date(lastPasswordChange.getTime() - 1000); // Token emitido antes da alteração de senha

        verifyToken.mockReturnValue({ id: 'userId', iat: Math.floor(tokenIssuedAt.getTime() / 1000) });
        User.findById.mockResolvedValue({ lastPasswordChange, email: 'test@example.com' });

        await authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            code: Constants.AUTH.TOKEN_EXPIRED_PASSWORD_CHANGE.CODE,
            message: Constants.AUTH.TOKEN_EXPIRED_PASSWORD_CHANGE.MESSAGE,
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('deve prosseguir para o próximo middleware se o token e o usuário forem válidos', async () => {
        const lastPasswordChange = new Date();
        const tokenIssuedAt = new Date(lastPasswordChange.getTime() + 1000); // Token emitido depois da alteração de senha

        verifyToken.mockReturnValue({ id: 'userId', email: 'test@example.com', iat: Math.floor(tokenIssuedAt.getTime() / 1000) });
        User.findById.mockResolvedValue({ lastPasswordChange, email: 'test@example.com' });

        await authMiddleware(req, res, next);

        expect(verifyToken).toHaveBeenCalledWith('valid-token');
        expect(User.findById).toHaveBeenCalledWith('userId');
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    it('deve retornar 500 em caso de erro durante a verificação do token', async () => {
        const errorMessage = 'Error during token verification';
        verifyToken.mockImplementation(() => {
            throw new Error(errorMessage);
        });

        await authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            code: Constants.ERROR.SERVER_ERROR.CODE,
            message: Constants.ERROR.SERVER_ERROR.MESSAGE,
        });
        expect(next).not.toHaveBeenCalled();
    });
});
