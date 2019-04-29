import { ApolloServer } from 'apollo-server-express';
import Express from 'express';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { createConnection } from 'typeorm';

import { createSchema } from './modules/utils/createSchema';
import { redis } from './redis';
import { SESS_NAME, SESS_SECRET, SESS_LIFETIME, IN_PROD } from './config';
import { createUsersLoader } from './modules/utils/usersLoader';

const main = async () => {
  await createConnection();

  const schema = await createSchema();

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }: any) => ({
      req,
      res,
      usersLoader: createUsersLoader(),
    }),
  });

  const app = Express();

  const corsOptions = {
    credentials: true,
    origin: 'http://localhost:3000',
  };

  const RedisStore = connectRedis(session);

  app.use(
    session({
      store: new RedisStore({
        client: redis as any,
      }),
      name: SESS_NAME,
      secret: SESS_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: IN_PROD,
        maxAge: parseInt(SESS_LIFETIME as string, 10),
      },
    } as any)
  );

  apolloServer.applyMiddleware({ app, cors: corsOptions });
  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log(`Server listening on http://localhost:4000/graphql`);
  });
};

main();
