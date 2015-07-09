/** The layer that this file provides */
const LAYER = "service";
/** The stack that this file is for */
const STACK = "worlds";

/**
 * Set up all of the Seneca Actions for the Service layer of the Worlds stack
 */
export default function() {
    const seneca = this;

    seneca.add({layer: LAYER, stack: STACK, cmd: "list"}, (args, done) => {
        seneca.act({
            layer: "dal",
            stack: STACK,
            cmd: "list"
        }, done);
    });
}
