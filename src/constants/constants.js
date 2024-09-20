const Constants = {
    VALIDATION: {
        FAILED: {
            CODE: 'VALIDATION_FAILED',
            MESSAGE: 'Validation failed during registration: ',
        },
    },
  
    USER: {
        ALREADY_EXISTS: {
            CODE: 'USER_ALREADY_EXISTS',
            MESSAGE: 'User already exists',
        },
        CREATED: {
            CODE: 'USER_CREATED',
            MESSAGE: 'User created.',
        },
        NOT_FOUND: {
            CODE: 'USER_NOT_FOUND',
            MESSAGE: 'User not found.',
        },
        LOGIN_SUCCESSFUL: {
            CODE: 'LOGIN_SUCCESSFUL',
            MESSAGE: 'Login successful',
        },
        PASSWORD_RESET_SUCCESSFUL: {
            CODE: 'PASSWORD_RESET_SUCCESSFUL',
            MESSAGE: 'Password was reset.',
        },
        PASSWORD_RESET_EMAIL_SENT: {
            CODE: 'PASSWORD_RESET_EMAIL_SENT',
            MESSAGE: 'E-mail was sent.',
        },
    },
  
    AUTH: {
        INVALID_EMAIL_OR_PASSWORD: {
            CODE: 'INVALID_EMAIL_OR_PASSWORD',
            MESSAGE: 'Invalid email or password',
        },
        TOKEN_INVALID: {
            CODE: 'TOKEN_INVALID',
            MESSAGE: 'Invalid or expired token.',
        },
        TOKEN_GENERATION_FAILED: {
            CODE: 'TOKEN_GENERATION_FAILED',
            MESSAGE: 'Token generation failed.',
        },
        TOKEN_VERIFICATION_FAILED: {
            CODE: 'TOKEN_VERIFICATION_FAILED',
            MESSAGE: 'Token verification failed.',
        },
        NO_TOKEN: {
            CODE: 'NO_TOKEN',
            MESSAGE: 'Access denied. No token provided.',
        },
        TOKEN_EXPIRED_PASSWORD_CHANGE: {
            CODE: 'TOKEN_EXPIRED_PASSWORD_CHANGE',
            MESSAGE: 'Token is invalid, password was changed.',
        },
    },
  
    ERROR: {
        SERVER_ERROR: {
            CODE: 'SERVER_ERROR',
            MESSAGE: 'Server error',
        },
        EMAIL_SEND_ERROR: {
            CODE: 'EMAIL_SEND_ERROR',
            MESSAGE: 'Error sending e-mail.',
        },
        EMAIL_SUCCESS: {
            CODE: 'EMAIL_SUCCESS',
            MESSAGE: 'Email successfully sent.',
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
