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
            MESSAGE: 'ERro no servidor',
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
            NEW_USER_REGISTERED: 'New user registered with email: ',
            USER_ALREADY_REGISTERED: 'Attempt to register existing user with email: ',
        },
        LOGIN: {
            INVALID_EMAIL: 'Invalid login attempt: user with email ',
            INVALID_PASSWORD: 'Invalid login attempt: wrong password for email ',
            SUCCESSFUL_LOGIN: 'User logged in successfully: ',
        },
        PASSWORD_RESET: {
            EMAIL_SENT: 'Password reset email sent to: ',
            ATTEMPT_NON_EXISTENT_USER: 'Password reset attempt for non-existent user ID: ',
        },
        EMAIL: {
            SUCCESS: 'Email successfully sent to ',
            ERROR: 'Error sending email to ',
        },
        AUTH: {
            TOKEN_GENERATED: 'Token generated for user: ',
            TOKEN_GENERATION_FAILED: 'Error generating token for user: ',
            TOKEN_VERIFIED: 'Token verified successfully for user: ',
            TOKEN_VERIFICATION_FAILED: 'Token verification failed: ',
        },
    },
};

module.exports = Constants;
