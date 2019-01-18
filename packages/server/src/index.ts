import "reflect-metadata";
require("dotenv-safe").config();

import * as express from "express";
import * as passport from "passport";
import { ApolloServer } from "apollo-server-express";
import { Strategy as GithubStrategy } from "passport-github";

import { createTypeormConn } from "./createTypeormConn";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./modules/user/UserResolver";

const startServer = async () => {
  await createTypeormConn();

  const app = express();

  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver]
    })
  });

  passport.use(
    new GithubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        callbackURL: "http://localhost:4000/auth/github/callback"
      },
      (accessToken, refreshToken, profile, cb) => {
        console.log(profile);
        cb(null, {});
      }
    )
  );

  server.applyMiddleware({ app }); // app is from an existing express app

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
};

startServer();
