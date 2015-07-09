/**
 * Set up all of the Seneca Actions for the REST layer of the Worlds stack
 * @param {Object} options the options for the plugin
 * @param {String} options.root The Root to listen on for the HTTP API
 */
export default function(options) {
    const seneca = this;
    const httpRoot = options.root;

    seneca.add({layer: "rest", stack: "worlds", cmd: "collection"}, (args, done) => {
        console.log(args);
        if (args.req$.method === "GET") {
            seneca.act({
                layer: "service",
                stack: "worlds",
                cmd: "list"
                }, done);
        } else if (args.req$.method === "POST") {
            seneca.act({
                layer: "service",
                stack: "worlds",
                cmd: "create"
                }, done);
        } else {
            done({error: "UNSUPPORTED_OPERATION"});
        }
    });

    seneca.add({layer: "rest", stack: "worlds", cmd: "item"}, (args, done) => {
        done(null, args);
    });

    seneca.act("role:web", {use: {
      prefix: httpRoot,
      pin: {layer: "rest", stack: "worlds", cmd: "*"},
      map: {
          "collection": {
              GET: true,
              POST: {
                  useparams: false,
                  usequery: false,
                  dataprop: true
              },
              alias: "/worlds"
          },
          "item": {
              GET: true,
              PUT: true,
              DELETE: true,
              alias: "/worlds/:id"
          }
      }
    }});
}
