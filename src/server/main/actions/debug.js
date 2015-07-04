export default function() {
    const seneca = this;

    seneca.add({role: "debug", cmd: "ping"}, (args, done) => {
        done(null, args);
    });
}
