import senecaApp from "seneca";

/**
 * Set up the Seneca instance
 * @return {Seneca} the Seneca instance
 */
export function setupSeneca() {
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

    return seneca;
}
