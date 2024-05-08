import { Request } from "express";
import { GraphQLError } from "graphql";

export const authMiddleware = (
  req: Request,
) => {
  const session = req.session;
  const operationList = ["IntrospectionQuery", "Login", "Register"];

  if (!session.userId && !operationList.includes(req.body.operationName)) {
    throw new GraphQLError("Unauthorized", {
      extensions: {
        code: "UNAUTHORIZED",
        http: { status: 401 },
      },
    });
  }
};
