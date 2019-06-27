import { ApolloServer } from 'apollo-server-express';
import Express from 'express';
import session from 'express-session';
import connectRedis from 'connect-redis';
import cas from 'connect-cas';
import { createConnection } from 'typeorm';

import { createSchema } from './modules/utils/createSchema';
import { redis } from './redis';
import {
	SESS_NAME,
	SESS_SECRET,
	SESS_LIFETIME,
	IN_PROD,
	CAS_HOST,
	CAS_SERVICE_VALIDATE,
	CAS_LOGIN,
	ADMIN_NETID,
	ADMIN_EMAIL,
	ADMIN_PASSWORD,
	TEST_USER_EMAIL,
	TEST_USER_NETID,
	TEST_USER_PASSWORD,
} from './config';
import { createUsersLoader } from './modules/utils/usersLoader';
import { createSupervisorsLoader } from './modules/utils/supervisorsLoader';
import { createSupervisedDepartmentsLoader } from './modules/utils/supervisedDepartmentsLoader';
import { createDepartmentsLoader } from './modules/utils/departmentsLoader';
import { User } from './entity/User';

const main = async () => {
	await createConnection();

	const schema = await createSchema();

	const apolloServer = new ApolloServer({
		schema,
		context: ({ req, res }: any) => ({
			req,
			res,
			usersLoader: createUsersLoader(),
			supervisorsLoader: createSupervisorsLoader(),
			departmentsLoader: createDepartmentsLoader(),
			supervisedDepartmentsLoader: createSupervisedDepartmentsLoader(),
		}),
		playground: !IN_PROD,
	});

	const app = Express();

	const corsOptions = {
		credentials: true,
		origin: ['http://localhost:3000'],
	};

	const RedisStore = connectRedis(session);

	app.use(
		session({
			store: new RedisStore({
				client: redis as any,
			}),
			name: SESS_NAME,
			secret: SESS_SECRET,
			resave: true,
			saveUninitialized: false,
			rolling: true,
			cookie: {
				httpOnly: true,
				// TODO: Secure cookie -- need to handle reverse proxying behind nginx.
				secure: false,
				maxAge: +SESS_LIFETIME,
			},
		})
	);

	// Configure CAS login routes if in production.
	if (IN_PROD) {
		// Configure CAS
		cas.configure({
			host: CAS_HOST,
			paths: {
				serviceValidate: CAS_SERVICE_VALIDATE,
				login: CAS_LOGIN,
			},
		});

		app.get(
			'/login',
			cas.serviceValidate(),
			cas.authenticate(),
			async (req, res) => {
				const netId = req.session!.cas.user;

				const user = await User.findOne({ netId });

				if (user) {
					req.session!.userId = user.id;
					req.session!.isAdmin = user.admin;
				}

				// TODO: Handle user not found.

				return res.redirect('https://timeclockdev.library.msstate.edu/home');
			}
		);
	}

	apolloServer.applyMiddleware({ app, cors: corsOptions });
	apolloServer.applyMiddleware({ app });

	// Check for admin user and create one with supplied config credentials if one
	// does not already exist in the database.
	const adminUser = await User.findOne({ admin: true });

	if (!adminUser) {
		await User.create({
			netId: ADMIN_NETID,
			nineDigitId: '0___7___0',
			password: ADMIN_PASSWORD,
			firstName: 'Web',
			lastName: 'Master',
			email: ADMIN_EMAIL,
			admin: true,
		}).save();
	}

	const testUser = await User.findOne({ nineDigitId: '0___2___0' });

	if (!testUser) {
		await User.create({
			netId: TEST_USER_NETID,
			nineDigitId: '0___2___0',
			password: TEST_USER_PASSWORD,
			firstName: 'Test',
			lastName: 'User',
			email: TEST_USER_EMAIL,
			admin: false,
		}).save();
	}

	return app.listen(4000, () => {
		console.log('environment:', process.env.NODE_ENV);
		console.log(`Server listening on http://localhost:4000/graphql`);
	});
};

main();
