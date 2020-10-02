export {};

const { ApolloServer } = require("apollo-server");
const { ApolloGateway } = require("@apollo/gateway");

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

export type ServerProps = {
  url: string;
}

server.listen({ port }).then(({ url }: ServerProps) => {
  console.log(`Server ready at ${url}`);
});
