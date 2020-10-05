export {};

import { ApolloServer } from "apollo-server-express";
import { ApolloGateway } from "@apollo/gateway";

import express from "express";
const app = express();

const port = 4000;

const gateway = new ApolloGateway({
  serviceList: [
    { name: "characters", url: "http://localhost:4001" },
    { name: "classes", url: "http://localhost:4002" }
  ]
});

const server = new ApolloServer({ 
  gateway,
  subscriptions: false
});

server.applyMiddleware({ app });

export type ServerProps = {
  url: string;
}

app.listen({ port }, () => {
  console.log(`Server ready at http://localhost:${port}/graphql`);
});
