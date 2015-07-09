import senecaApp from "seneca";
import express from "express";
import bodyParser from "body-parser";
import sourceMapSupport from "source-map-support";
import staticFile from "connect-static-file";
import path from "path";

sourceMapSupport.install();

// Firstly, set up Seneca for all of the actual microservices
const seneca = senecaApp();
seneca.use("accessToken/service")
    .use("debug/actions", {root: "/api"})
    .use("worlds/dal")
    .use("worlds/service")
    .use("worlds/rest", {root: "/api"});

// Now set up Express to handle the HTTP side of things
const app = express();

app.use(bodyParser.json());

// Serve up the Static resources
app.use("/api/schema", staticFile(path.join(__dirname, "schema", "schema.json"), {
    etag: true,
    lastModified: true
}));

// And then set up Seneca to export a number of actions over HTTP
app.use(seneca.export("web"));

app.listen(3000);
