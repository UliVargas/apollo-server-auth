// Express imports
import express from "express";
import http from "http";
import session from "express-session";
import cookieParser from "cookie-parser";

// Apollo Server imports
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { ApolloServerPluginInlineTraceDisabled } from "@apollo/server/plugin/disabled";
import gql from "graphql-tag";

// Local imports
import { resolvers } from "./resolvers";
import { Book, Login } from "./types/graphql";
import { authMiddleware } from "./middleware/auth.middleware";

// Node imports
import { readFileSync } from "fs";


const app = express();
const httpServer = http.createServer(app);
app.use(cookieParser());

export interface MyContext {
  req: express.Request;
  dataSources: {
    books: Book[];
    login: Login;
  };
}

const typeDefs = gql(
  readFileSync("src/schema.graphql", {
    encoding: "utf-8",
  })
);

const server = new ApolloServer<MyContext>({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
  introspection: process.env.NODE_ENV !== "production",
  plugins: [ApolloServerPluginInlineTraceDisabled()],
});

const main = async () => {
  await server.start();

  app.use(
    session({
      name: "auth_session_video_denuncia",
      secret: "tu_super_secreto",
      resave: true,
      saveUninitialized: true,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24,
        path: "/",
        sameSite: "lax",
      },
    })
  );

  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        /* 
          This is the middleware that we are going to use to check
          if the user is logged in or not before executing the query 
        */
        authMiddleware(req);

        return {
          req,
          dataSources: {
            books: [
              {
                title: "Harry Potter",
                author: "J.K. Rowling",
              },
              {
                title: "Jurassic Park",
                author: "Michael Crichton",
              },
            ],
            login: {
              message: "You are logged in",
            },
          },
        };
      },
    })
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:4000/graphql`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
