import sourceMapSupport from "source-map-support";
import {configureExpress} from "express/express";
import {routes} from "express/routes";

sourceMapSupport.install();

const app = configureExpress(routes);
app.listen(3000);
