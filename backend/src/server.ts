import express from "express";
import { ApolloServer } from "apollo-server-express";
import dotenv from "dotenv";
import connectDB from "./config";
import typeDefs from "./schema";
import resolvers from "./resolvers";
import jwt from "jsonwebtoken";

dotenv.config();

const startServer = async () => {
  const app = express() as any;

  await connectDB();  

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = req.headers.authorization || "";
      let user = null;

      if (token) {
        try {
          user = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET as string);
        } catch (err) {
          console.error("Invalid token");
        }
      }

      return { user };
    },
  });

  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/graphql`);
  });
};

startServer();
