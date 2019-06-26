import { graphql, GraphQLSchema } from 'graphql';
import { Maybe } from 'type-graphql';

import { createSchema } from '../modules/utils/createSchema';

interface Options {
	source: string;
	variableValues?: Maybe<{
		[key: string]: any;
	}>;
	userId?: string | undefined;
	isAdmin?: boolean;
}

let schema: GraphQLSchema;

export const gCall = async ({
	source,
	variableValues,
	userId,
	isAdmin = false,
}: Options) => {
	if (!schema) {
		schema = await createSchema();
	}

	return graphql({
		schema,
		source,
		variableValues,
		contextValue: {
			req: {
				session: {
					userId,
					isAdmin,
				},
			},
			res: {
				clearCookie: jest.fn(),
			},
		},
	});
};
