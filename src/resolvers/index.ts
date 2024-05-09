import { Resolvers } from "../types/graphql";

export const resolvers: Resolvers = {
  Query: {
    books: (_, __, context) => {
      return context.dataSources.books;
    },
    login: (_, __, context) => {
      context.req.session.sessionId = 1;
      context.req.session.user = {
        id: 1,
        email: "josue@example.com",
        role: "admin",
        name: "Josue",
      }
      return context.dataSources.login;
    },
    getSession: (_, __, context) => {
      return {
        sessionId: context.req.session.sessionId,
        user: context.req.session.user,
      }
    }
  }
};
