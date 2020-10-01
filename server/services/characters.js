const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const fetch = require("node-fetch");

const port = 4001;
const apiUrl = "http://localhost:3000";

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
    async characters(rpgClass) {
      const res = await fetch(`${apiUrl}/characters`);
      const characters = await res.json();
      console.log({characters})

      return characters.filter(({ classes }) =>
        classes.includes(parseInt(rpgClass.id))
      );
    }
  },
  Character: {
    classes(character) {
      return character.classes.map(id => ({ __typename: "RpgClass", id }));
    }
  },
  Query: {
    character(_, { id }) {
      return fetch(`${apiUrl}/characters/${id}`).then(res => res.json());
    },
    characters() {
      return fetch(`${apiUrl}/characters`).then(res => res.json());
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }])
});

server.listen({ port }).then(({ url }) => {
  console.log(`Characters service ready at ${url}`);
});
