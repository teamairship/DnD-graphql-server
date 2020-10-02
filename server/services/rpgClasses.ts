
export {};

const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
import { ServerProps } from "..";
const fetch = require("node-fetch");

const port = 4002;
const apiUrl = "http://localhost:3000";

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
    __resolveReference(ref: { id: any; }) {
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
