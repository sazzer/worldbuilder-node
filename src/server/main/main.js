import senecaApp from "seneca";
import express from "express";
import bodyParser from "body-parser";

const seneca = senecaApp();

seneca.add("role:api,cmd:zig", (args, done) =>
    done(null, {zig: args.zoo + "g"})
);

seneca.add("role:api,cmd:bar", (args, done) =>
    done(null, {bar: args.zoo + "b"})
);

seneca.add("role:api,cmd:qaz", (args, done) =>
    done(null, {qaz: args.zoo + "z"})
);


seneca.act("role:web", {use: {
  // define some routes that start with /my-api
  prefix: "/my-api",

  // use action patterns where role has the value "api" and cmd has some defined value
  pin: {role: "api", cmd: "*"},

  // for each value of cmd, match some HTTP method, and use the
  // query parameters as values for the action
  map: {
    zig: true,                   // GET is the default
    bar: {GET: true},            // explicitly accepting GETs
    qaz: {GET: true, POST: true} // accepting both GETs and POSTs
  }
}});

const app = express();

app.use(bodyParser.json());

// This is how you integrate Seneca with Express
app.use(seneca.export("web"));

app.listen(3000);
