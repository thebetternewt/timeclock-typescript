import { getConnection, getConnectionManager } from 'typeorm';
import faker from 'faker';

import { User } from '../entity/User';

beforeAll(async () => {
	console.log('running beforAll...');

	const connectionManager = getConnectionManager();
	const conn = connectionManager.create({
		type: 'postgres',
		host: 'localhost',
		port: 5432,
		username: 'postgres',
		password: 'postgres',
		database: 'timeclock-test',
		synchronize: true,
		dropSchema: true,
		entities: [`${__dirname}/../entity/*.*`],
	});

	await conn.connect();

	// Create admin user
	await User.create({
		netId: faker.random.alphaNumeric(6),
		nineDigitId: faker.helpers.replaceSymbolWithNumber('#########'),
		firstName: faker.name.firstName(),
		lastName: faker.name.lastName(),
		email: faker.internet.email(),
		dsf: false,
		admin: true,
	}).save();

	// Create 5 non-admin users
	for (let i = 0; i < 5; i++) {
		await User.create({
			netId: faker.random.alphaNumeric(6),
			nineDigitId: faker.helpers.replaceSymbolWithNumber('#########'),
			firstName: faker.name.firstName(),
			lastName: faker.name.lastName(),
			email: faker.internet.email(),
			dsf: false,
			admin: false,
		}).save();
	}

	// console.log('[USERS]:', await User.find());
});

afterAll(async () => {
	await getConnection().close();
});
