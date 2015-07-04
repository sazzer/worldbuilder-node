import {startServer} from "server/http";
import {setupSeneca} from "actions/seneca";

const seneca = setupSeneca();
startServer(3000, seneca);
