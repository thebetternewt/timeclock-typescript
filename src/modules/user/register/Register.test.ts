import faker from 'faker';

import { gCall } from '../../../test-utils/gcall';
import { User } from '../../../entity/User';

const registerMutation = `
  mutation Register($data: UserInput!) {
    register(data: $data) {
      netId
      nineDigitId
      name
      email
      admin
    }
  }
`;

describe('Register', () => {
	it('creates user as admin', async () => {
		const adminUser = await User.findOne({ admin: true });

		console.log('adminUser:', adminUser);

		const newUser = {
			netId: faker.random.alphaNumeric(6),
			nineDigitId: faker.helpers.replaceSymbolWithNumber('#########'),
			firstName: faker.name.firstName(),
			lastName: faker.name.lastName(),
			email: faker.internet.email(),
			dsf: false,
			admin: false,
		};

		const result = await gCall({
			source: registerMutation,
			variableValues: {
				data: newUser,
			},
			userId: adminUser!.id,
			isAdmin: adminUser!.admin,
		});

		console.log('adminRes:', result);

		expect(result).toMatchObject({
			data: {
				register: {
					netId: newUser.netId,
					nineDigitId: newUser.nineDigitId,
					name: `${newUser.firstName} ${newUser.lastName}`,
					email: newUser.email.toLowerCase(),
					admin: newUser.admin,
				},
			},
		});

		const dbUser = await User.findOne({ netId: newUser.netId });
		expect(dbUser).toBeDefined();
	});

	it('does not create user as non-admin', async () => {
		const normalUserData = {
			netId: faker.random.alphaNumeric(6),
			nineDigitId: faker.helpers.replaceSymbolWithNumber('#########'),
			firstName: faker.name.firstName(),
			lastName: faker.name.lastName(),
			email: faker.internet.email(),
			dsf: false,
			admin: false,
		};

		console.log('normalData:', normalUserData);

		const normalUser = await User.create(normalUserData).save();

		const newUser = {
			netId: faker.random.alphaNumeric(6),
			nineDigitId: faker.helpers.replaceSymbolWithNumber('#########'),
			firstName: faker.name.firstName(),
			lastName: faker.name.lastName(),
			email: faker.internet.email(),
			dsf: false,
			admin: false,
		};

		const result = await gCall({
			source: registerMutation,
			variableValues: {
				data: newUser,
			},
			userId: normalUser.id,
			isAdmin: normalUser.admin,
		});

		expect(result).toMatchObject({
			data: null,
		});

		const dbUser = await User.findOne({ netId: newUser.netId });
		expect(dbUser).toBeUndefined();
	});
});
