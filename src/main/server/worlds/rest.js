/** The layer that this file provides */
const LAYER = "rest";
/** The stack that this file is for */
const STACK = "worlds";

/**
 * Set up all of the Seneca Actions for the REST layer of the Worlds stack
 * @param {Object} options the options for the plugin
 * @param {String} options.root The Root to listen on for the HTTP API
 */
export default function(options) {
    const seneca = this;
    const httpRoot = options.root;

    seneca.add({layer: LAYER, stack: STACK, cmd: "list"}, (args, done) => {
        seneca.act({
            layer: "service",
            stack: STACK,
            cmd: "list"
        }, done);
    });

    seneca.add({layer: LAYER, stack: STACK, cmd: "get"}, (args, done) => {
        done(null, args);
    });

    seneca.add({layer: LAYER, stack: STACK, cmd: "create"}, (args, done) => {
        done(null, args);
    });

    seneca.add({layer: LAYER, stack: STACK, cmd: "update"}, (args, done) => {
        done(null, args);
    });

    seneca.add({layer: LAYER, stack: STACK, cmd: "delete"}, (args, done) => {
        done(null, args);
    });

    seneca.act("role:web", {use: {
      prefix: httpRoot,
      pin: {layer: LAYER, stack: STACK, cmd: "*"},
      map: {
          "list": {
              GET: true,
              alias: "/worlds"
          },
          "get": {
              GET: true,
              alias: "/worlds/:id"
          },
          "create": {
              POST: true,
              alias: "/worlds"
          },
          "update": {
              PUT: true,
              alias: "/worlds/:id"
          },
          "delete": {
              DELETE: true,
              alias: "/worlds/:id"
          }
      }
    }});
}
