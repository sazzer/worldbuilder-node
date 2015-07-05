import moment from "moment-timezone";
import {authenticated} from "seneca/authentication";

/**
 * Set up all of the Seneca Actions for the Debug service
 * @param {Object} options the options for the plugin
 * @param {String} options.root The Root to listen on for the HTTP API
 */
export default function(options) {
    const seneca = this;
    const httpRoot = options.root;

    seneca.add({role: "debug", cmd: "ping"}, (args, done) => {
        done(null, args);
    });

    seneca.add({role: "debug", cmd: "now"}, (args, done) => {
        const tz = args.tz || "UTC";

        done(null, {
            tz,
            now: moment().tz(tz).format()
        });
    });

    seneca.add({role: "debug", cmd: "whoami"}, (args, done) => {
        done(null, {who: args.req$.user});
    });

    seneca.act("role:web", {use: {
      // define some routes that start with /my-api
      prefix: httpRoot + "/debug",

      // use action patterns where role has the value "api" and cmd has some defined value
      pin: {role: "debug", cmd: "*"},

      // for each value of cmd, match some HTTP method, and use the
      // query parameters as values for the action
      map: {
        ping: {
            GET: true,
            POST: true
        },
        now: {
            GET: true
        },
        whoami: {
            GET: true,
            premap: authenticated(["a", "b"])
        }
      }
    }});
}
