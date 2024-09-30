const Constants = {
    VALIDATION: {
        FAILED: {
            CODE: 'VALIDATION_FAILED',
            MESSAGE: 'Erro durante a validação: ',
        },
    },
  
    USER: {
        ALREADY_EXISTS: {
            CODE: 'USER_ALREADY_EXISTS',
            MESSAGE: 'Usuário já existe',
        },
        CREATED: {
            CODE: 'USER_CREATED',
            MESSAGE: 'Usuário criado com sucesso.',
        },
        NOT_FOUND: {
            CODE: 'USER_NOT_FOUND',
            MESSAGE: 'Usuário não encontrado.',
        },
        LOGIN_SUCCESSFUL: {
            CODE: 'LOGIN_SUCCESSFUL',
            MESSAGE: 'Login feito com sucesso',
        },
        PASSWORD_RESET_SUCCESSFUL: {
            CODE: 'PASSWORD_RESET_SUCCESSFUL',
            MESSAGE: 'Sua senha foi alterada.',
        },
        PASSWORD_RESET_EMAIL_SENT: {
            CODE: 'PASSWORD_RESET_EMAIL_SENT',
            MESSAGE: 'E-mail para alterar senha foi enviado.',
        },
    },
  
    AUTH: {
        INVALID_EMAIL_OR_PASSWORD: {
            CODE: 'INVALID_EMAIL_OR_PASSWORD',
            MESSAGE: 'Email ou senha incorretos.',
        },
        TOKEN_INVALID: {
            CODE: 'TOKEN_INVALID',
            MESSAGE: 'Token inválido.',
        },
        TOKEN_VALID: {
            CODE: 'TOKEN_VALID',
            MESSAGE: 'Token válido.',
        },
        TOKEN_GENERATION_FAILED: {
            CODE: 'TOKEN_GENERATION_FAILED',
            MESSAGE: 'Falha ao gerar token.',
        },
        TOKEN_VERIFICATION_FAILED: {
            CODE: 'TOKEN_VERIFICATION_FAILED',
            MESSAGE: 'Falha ao verificar token.',
        },
        NO_TOKEN: {
            CODE: 'NO_TOKEN',
            MESSAGE: 'Acesso negado.',
        },
        TOKEN_EXPIRED_PASSWORD_CHANGE: {
            CODE: 'TOKEN_EXPIRED_PASSWORD_CHANGE',
            MESSAGE: 'Token inválido, senha foi alterada.',
        },
    },
  
    ERROR: {
        SERVER_ERROR: {
            CODE: 'SERVER_ERROR',
            MESSAGE: 'Erro no servidor',
        },
        EMAIL_SEND_ERROR: {
            CODE: 'EMAIL_SEND_ERROR',
            MESSAGE: 'Erro ao enviar e-mail.',
        },
        EMAIL_SUCCESS: {
            CODE: 'EMAIL_SUCCESS',
            MESSAGE: 'E-mail enviado com sucesso.',
        },
    },
  
    LOGGER: {
        REGISTER: {
            NEW_USER_REGISTERED: 'Novo usuário registrado com o e-mail: ',
            USER_ALREADY_REGISTERED: 'Tentativa de registro de usuário já existente com o e-mail: ',
        },
        LOGIN: {
            INVALID_EMAIL: 'Tentativa de login inválida: usuário com o e-mail ',
            INVALID_PASSWORD: 'Tentativa de login inválida: senha incorreta para o e-mail ',
            SUCCESSFUL_LOGIN: 'Usuário logado com sucesso: ',
        },
        PASSWORD_RESET: {
            EMAIL_SENT: 'E-mail de redefinição de senha enviado para: ',
            ATTEMPT_NON_EXISTENT_USER: 'Tentativa de redefinição de senha para usuário inexistente com o ID: ',
        },
        EMAIL: {
            SUCCESS: 'E-mail enviado com sucesso para ',
            ERROR: 'Erro ao enviar e-mail para ',
        },
        AUTH: {
            TOKEN_VALIDATION: 'Validando token',
            TOKEN_GENERATED: 'Token gerado para o usuário: ',
            TOKEN_GENERATION_FAILED: 'Erro ao gerar token para o usuário: ',
            TOKEN_VERIFIED: 'Token verificado com sucesso para o usuário: ',
            TOKEN_VERIFICATION_FAILED: 'Falha na verificação do token: ',
        },
    },
  
    LEAD: {
        ALREADY_EXISTS: {
            CODE: 'LEAD_EXISTS',
            MESSAGE: 'O e-mail já está cadastrado.',
        },
        CREATED: {
            CODE: 'LEAD_CREATED',
            MESSAGE: 'Obrigado por se inscrever! Em breve, você receberá mais informações.',
        },
    },
};

module.exports = Constants;
