import { buildSchema, AuthChecker } from 'type-graphql';
import { MyContext } from '../../types/MyContext';

const authChecker: AuthChecker<MyContext> = ({ context: { req } }, roles) => {
  // here we can read the user from context
  // and check his permission in the db against the `roles` argument
  // that comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]

  console.log('roles:', roles);

  return !!req.session!.userId;
};

export const createSchema = () =>
  buildSchema({
    resolvers: [`${__dirname}/../**/*.resolver.ts`],
    authChecker,
  });
