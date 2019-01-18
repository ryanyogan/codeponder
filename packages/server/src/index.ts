import "reflect-metadata";
require("dotenv-safe").config();

import * as express from "express";
import * as passport from "passport";
import * as connectRedis from "connect-redis";
import * as session from "express-session";
import * as cors from "cors";

import { ApolloServer } from "apollo-server-express";
import { Strategy as GithubStrategy } from "passport-github";

import { createTypeormConn } from "./createTypeormConn";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./modules/user/UserResolver";
import { User } from "./entity/User";
import { redis } from "./redis";

const RedisStore = connectRedis(session as any);

const startServer = async () => {
  await createTypeormConn();

  const app = express();

  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
    }),
    context: ({ req }: any) => ({ req }),
  });

  app.set("trust proxy", 1);

  app.use(
    cors({
      credentials: true,
      origin:
        process.env.NODE_ENV === "production"
          ? "https://codeponder.ryanyogan.com"
          : "http://localhost:3000",
    })
  );

  app.use((req, _, next) => {
    const { authorization } = req.headers;

    if (authorization) {
      try {
        const qid = authorization.split(" ")[1];
        req.headers.cookie = `qid=${qid}`;
      } catch (_) {}
    }

    return next();
  });

  app.use(
    session({
      store: new RedisStore({
        client: redis as any,
      }),
      name: "qid",
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 Days
      },
    } as any)
  );

  passport.use(
    new GithubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        callbackURL: "http://localhost:4000/oauth/github",
      },
      async (accessToken, refreshToken, profile: any, cb) => {
        let user = await User.findOne({ where: { githubId: profile.id } });

        if (!user) {
          user = await User.create({
            githubId: profile.id,
            pictureUrl: profile._json.avatar_url,
            bio: profile._json.bio,
          }).save();
        }

        console.log("New User", user);

        cb(null, {
          user,
          accessToken,
          refreshToken,
        });
      }
    )
  );

  app.use(passport.initialize());

  app.get("/auth/github", passport.authenticate("github", { session: false }));
  app.get(
    "/oauth/github",
    passport.authenticate("github", { session: false }),
    (req, res) => {
      if (req.user.user.id) {
        req.session!.userId = req.user.user.id;
        req.session!.accessToken = req.user.accessToken;
        req.session!.refreshToken = req.user.refreshToken;
      }

      res.redirect("http://localhost:3000");
    }
  );

  server.applyMiddleware({ app, cors: false }); // app is from an existing express app

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
};

startServer();
