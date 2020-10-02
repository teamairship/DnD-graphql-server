
export {};

const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
import { ServerProps } from "..";
const fetch = require("node-fetch");

const port = 4001;
const apiUrl = "http://localhost:3004";

const typeDefs = gql`
  type Character {
    id: ID!
    name: String
    level: Int
    classes: [RpgClass]
  }

  extend type RpgClass @key(fields: "id") {
    id: ID! @external
    characters: [Character]
  }

  extend type Query {
    character(id: ID!): Character
    characters: [Character]
  }
`;

const resolvers = {
  RpgClass: {
    async characters(rpgClass: { id: string; }) {
      const res = await fetch(`${apiUrl}/characters`);
      const characters = await res.json();

      return characters.filter(({ classes }: { classes: any[] }) =>
        classes.includes(parseInt(rpgClass.id))
      );
    }
  },
  Character: {
    classes(character: { classes: any[]; }) {
      return character.classes.map(id => ({ __typename: "RpgClass", id }));
    }
  },
  Query: {
    character(_: any, { id }: any) {
      return fetch(`${apiUrl}/characters/${id}`).then((res: { json: () => any; }) => res.json());
    },
    characters() {
      return fetch(`${apiUrl}/characters`).then((res: { json: () => any; }) => res.json());
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }])
});

server.listen({ port }).then(({ url }: ServerProps) => {
  console.log(`Characters service ready at ${url}`);
});
