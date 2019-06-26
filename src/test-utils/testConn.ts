import { createConnection } from 'typeorm';

export const testConn = async (drop: boolean = false) =>
	createConnection({
		type: 'postgres',
		host: 'localhost',
		port: 5432,
		username: 'postgres',
		password: 'postgres',
		database: 'timeclock-test',
		synchronize: drop,
		dropSchema: drop,
		entities: [`${__dirname}/../entity/*.*`],
	});
