import dotenv from 'dotenv';
dotenv.config();

export const IN_PROD = process.env.NODE_ENV === 'production';

export const {
	SESS_NAME = 'tsid',
	SESS_SECRET = 'aspa98hf9hwiu93',
	SESS_LIFETIME = 1000 * 60 * 5, // 5 minutes
	CAS_HOST,
	CAS_SERVICE_VALIDATE,
	CAS_LOGIN,
	ADMIN_NETID,
	ADMIN_EMAIL,
	ADMIN_PASSWORD,
} = process.env;
