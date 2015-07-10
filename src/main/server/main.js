import sourceMapSupport from "source-map-support";
import {configureExpress} from "express/express";

const routes = [
    "debug/routes"
].map(r => require(r).configureRoutes);

sourceMapSupport.install();

const app = configureExpress(routes);
app.listen(3000);
