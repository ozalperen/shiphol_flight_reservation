import rateLimit from 'express-rate-limit'

export const apiLimiter = rateLimit({
	windowMs: 30 * 60 * 1000, // 15 minutes
	max: 1000, // Limit each IP to 1000 requests per `window` (here, per 15 minutes)
    message:
        'Unusual trafic detected form this IP',
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});


export const registerLimiter = rateLimit({
	windowMs: 24 * 60 * 60 * 1000, 
	max: 100, 
	message:
		'Too many accounts created from this IP, please try again later',
	standardHeaders: true, 
	legacyHeaders: false, 
});

export const loginLimiter = rateLimit({
	windowMs: 10 * 60 * 1000, 
	max: 300, 
	message:
		'Too many login attemps requested from this IP, please try again after 10 minutes',
	standardHeaders: true, 
	legacyHeaders: false, 
});

export const emailResendLimiter = rateLimit({
	windowMs: 24 * 60 * 60 * 1000,
	max: 80,
	message:
		'Too many email resend command requested from this IP, please try again later',
	standardHeaders: true,
	legacyHeaders: false,
});

export const forgotPasswordLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 50,
	message:
		'Too many forgot password reset requested from this IP, please try again after 15 minutes',
	standardHeaders: true,
	legacyHeaders: false,
});

export const updatePasswordLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 30,
	message:
		'Too many forgot password update requested from this IP, please try again after 15 minutes',
	standardHeaders: true,
	legacyHeaders: false,
});


	