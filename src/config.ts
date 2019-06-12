import dotenv from 'dotenv';
dotenv.config();

export const IN_PROD = process.env.NODE_ENV === 'production';

export const {
	SESS_NAME = 'tsid',
	SESS_SECRET = 'aspa98hf9hwiu93',
	// SESS_LIFETIME = 1000 * 60 * 60 * 2, // 2 hours
	SESS_LIFETIME = 1000 * 60 * 5, // 5 minutes
} = process.env;
