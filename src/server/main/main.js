import senecaApp from "seneca";
import express from "express";
import bodyParser from "body-parser";

const seneca = senecaApp();

seneca.use("actions/debug");

seneca.act("role:web", {use: {
  // define some routes that start with /my-api
  prefix: "/api/debug",

  // use action patterns where role has the value "api" and cmd has some defined value
  pin: {role: "debug", cmd: "*"},

  // for each value of cmd, match some HTTP method, and use the
  // query parameters as values for the action
  map: {
    ping: {
        GET: true,
        POST: true
    }
  }
}});

const app = express();

app.use(bodyParser.json());

// This is how you integrate Seneca with Express
app.use(seneca.export("web"));

app.listen(3000);
