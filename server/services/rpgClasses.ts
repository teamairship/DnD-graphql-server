export {};

import { ApolloServer, gql } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";

import { ServerProps } from "..";
import fetch from "node-fetch";

const port: number = 4002;
const apiUrl: string = "http://localhost:3004";

const typeDefs = gql`
  type RpgClass @key(fields: "id") {
    id: ID!
    name: String
    hitdice: String
  }

  extend type Query {
    class(id: ID!): RpgClass
    classes: [RpgClass]
  }
`;

const resolvers = {
  RpgClass: {
    __resolveReference(ref: { id: string; }) {
      return fetch(`${apiUrl}/classes/${ref.id}`).then((res: { json: () => any; }) => res.json());
    }
  },
  Query: {
    class(_: any, { id }: any) {
      return fetch(`${apiUrl}/classes/${id}`).then((res: { json: () => any; }) => res.json());
    },
    classes() {
      return fetch(`${apiUrl}/classes`).then((res: { json: () => any; }) => res.json());
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }])
});

server.listen({ port }).then(({ url }: ServerProps) => {
  console.log(`Class service ready at ${url}`);
});
