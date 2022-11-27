import React from "react";
import "./App.css";
import Board from "./components/Board/Board";
import { getMainDefinition } from "@apollo/client/utilities";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  split,
} from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

const httpLink = new HttpLink({ uri: "http://localhost:4445/graphql" });

const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:4445/graphql",
  })
);

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App" style={{ height: "100vh" }}>
        <Board />
      </div>
    </ApolloProvider>
  );
}

export default App;
