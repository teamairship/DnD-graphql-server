const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
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
    __resolveReference(ref) {
      return fetch(`${apiUrl}/classes/${ref.id}`).then(res => res.json());
    }
  },
  Query: {
    class(_, { id }) {
      return fetch(`${apiUrl}/classes/${id}`).then(res => res.json());
    },
    classes() {
      return fetch(`${apiUrl}/classes`).then(res => res.json());
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }])
});

server.listen({ port }).then(({ url }) => {
  console.log(`Class service ready at ${url}`);
});
