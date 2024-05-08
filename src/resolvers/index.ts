import { Resolvers } from "../types/graphql";

export const resolvers: Resolvers = {
  Query: {
    books: (_, __, context) => {
      return context.dataSources.books;
    },
    login: (_, __, context) => {
      context.req.session.userId = 'user_id';
      return context.dataSources.login;
    }
  }
};
