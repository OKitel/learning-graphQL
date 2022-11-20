const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const merge = require("lodash/merge");
const mongoose = require("mongoose");
const { PubSub } = require("apollo-server");
const { createServer } = require("http");
require("dotenv").config();
const { sectionResolvers, sectionTypeDefs } = require("./section");
const { cardResolvers, cardTypeDefs } = require("./card");
const sectionModel = require("./section/model");
const cardModel = require("./card/model");

const typeDefs = gql`
  ${cardTypeDefs}
  ${sectionTypeDefs}
`;

const customResolvers = {
  Section: {
    cards(parent, args, cxt) {
      return cxt.card.getCardBySectionId(parent._id);
    },
  },
};

const resolvers = merge(cardResolvers, sectionResolvers, customResolvers);

const MONGO_USER = process.env.MONGO_USER || "root";
const MONGO_PASS = process.env.MONGODB_PASS;

mongoose
  .connect(
    `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@learning-graphql.8mdi7rc.mongodb.net/?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("mongodb connected successfully");
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: () => ({
        card: cardModel,
        section: sectionModel,
      }),
    });
    const app = express();
    server.applyMiddleware({ app });
    const httpServer = createServer(app);
    server.installSubscriptionHandlers(httpServer);
    const PORT = process.env.PORT || 4444;
    httpServer.listen({ port: PORT }, () => {
      console.log(`Server is running in port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
