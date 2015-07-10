import express from "express";
import bodyParser from "body-parser";
import sourceMapSupport from "source-map-support";
import staticFile from "connect-static-file";
import path from "path";

sourceMapSupport.install();

// Now set up Express to handle the HTTP side of things
const app = express();

app.use(bodyParser.json());

// Serve up the Static resources
app.use("/api/schema", staticFile(path.join(__dirname, "schema", "schema.json"), {
    etag: true,
    lastModified: true
}));

app.listen(3000);
