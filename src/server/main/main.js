import senecaApp from "seneca";
import express from "express";
import bodyParser from "body-parser";

// Firstly, set up Seneca for all of the actual microservices
const seneca = senecaApp();
seneca.use("debug/actions", {root: "/api"});

// Now set up Express to handle the HTTP side of things
const app = express();

app.use(bodyParser.json());

// And then set up Seneca to export a number of actions over HTTP
app.use(seneca.export("web"));

app.listen(3000);
