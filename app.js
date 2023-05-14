var express = require('express');
const session = require('express-session');
const flash = require('express-flash');
const {graphqlHTTP} = require('express-graphql');
var { buildSchema } = require('graphql');
var { makeExecutableSchema } = require('@graphql-tools/schema');
var config = require('config');
var bodyParser = require('body-parser');
var expressLayouts=require("express-ejs-layouts");
const crawnNewPosts = require('./apps/jobs/crawnNewPosts');

// Initialize a GraphQL schema
// var schema = buildSchema(`
  const typeDefs = `
    type Query {
      hello: String
      user(id: Int!): Person
      users(name: String): [Person]
    },
    type Mutation {
      updateUser(id: Int!, firstName: String!, email: String): Person
    },
    type Person {
      id: Int!
      firstName: String
      lastName: String
      email: String
    }
  `;

const sampleData = {
  sampleUsers: [
    {id: 1, firstName: 'a', lastName: 'b', email: 'hoangbk@gmail.com'},
    {id: 2, firstName: 'a2', lastName: 'b2', email: 'hoangbk2@gmail.com'},
    {id: 3, firstName: 'a3', lastName: 'b3', email: 'hoangbk3@gmail.com'},
    {id: 4, firstName: 'a4', lastName: 'b4', email: 'hoangbk4@gmail.com'},
  ]
}

// Root resolver
const resolvers = {
  Query: {
    hello: (obj, args, context, info) => 'Hello world!',
    user: (obj, args, context, info) => (
      {id: 1, firstName: 'a', lastName: 'b', email: 'hoangbk@gmail.com'}
    ),
    users: (obj, args, context, info) => (
      context.sampleUsers.filter(user => user.firstName.includes(args.name) || user.lastName.includes(args.name))
    ),
  },

  Mutation: {
    updateUser: (obj, args, context, info) => {
      const user = context.sampleUsers.find(user => user.id === args.id);
      user.firstName = args.firstName
      user.email = args.email
      return context.sampleUsers.find(user => user.id === args.id)
    }
  }
};

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

var app = express();

app.use(session({
  secret: 'my-secret-key',
  resave: false,
  saveUninitialized: false,
}));

// set up express-flash middleware
app.use(flash());


// body parser
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.set("views", __dirname + "/apps/views");
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set('layout', 'layouts/layout');

// static folder
app.use("/static", express.static(__dirname + "/public"));

var controllers = require(__dirname + "/apps/controllers");

app.use(controllers);

app.use('/graphql', graphqlHTTP({
  // schema: schema,  // Must be provided
  schema: executableSchema,  // Must be provided
  // rootValue: root,
  context: sampleData,
  graphiql: true,  // Enable GraphiQL when server endpoint is accessed in browser
}));

// Cronjob
crawnNewPosts();

var host = config.get("server.host");
var port = config.get('server.port');
app.listen(port, host, function() {
  console.log('server is running on port ', port);
  console.log('Now browse to localhost:3000/graphql');
});