import { Resolver, Query } from 'type-graphql';

@Resolver()
export class RegisterResolver {
  @Query(() => String)
  async hello() {
    return 'Hello, world!';
  }
}
