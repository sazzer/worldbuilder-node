/* eslint-env mocha */
import {expect} from "chai";
import sinon from "sinon";
import {authenticated} from "seneca/authentication";

function runTest({scopes, token, error, success}) {
    let errorResponse;
    if (error) {
        errorResponse = {
            orig: {
                code: error
            }
        };
    }
    const seneca = {
        act: sinon.stub()
            .yields(errorResponse, success)
    };

    const req = {
        header: sinon.stub().withArgs("Authorization")
            .returns(token),
        seneca
    };

    const res = {};

    res.status = sinon.stub().returnsThis();
    res.send = sinon.stub().returnsThis();

    const next = sinon.spy();

    const middleware = authenticated(scopes);

    middleware(req, res, next);

    return {req, res, next, seneca};
}

describe("seneca/authentication", () => {
    describe("If no header is provided", () => {
        const {res, next} = runTest({
            scopes: []
        });

        it("Returns a status of 401", () => {
            expect(res.status.callCount).to.equal(1);
            expect(res.status.getCall(0).args[0]).to.equal(401);
        });

        it("Returns the expected error", () => {
            expect(res.send.callCount).to.equal(1);
            expect(res.send.getCall(0).args[0]).to.have.keys("error");
            expect(res.send.getCall(0).args[0]).to.have.property("error")
                .that.is.a("string")
                .that.equals("NO_AUTHORIZATION_HEADER");
        });

        it("Never called the rest of the chain", () => {
            expect(next.callCount).to.equal(0);
        });
    });

    describe("If a header that isn't a Bearer is provided", () => {
        const {res, next} = runTest({
            scopes: [],
            token: "abcdef"
        });

        it("Returns a status of 401", () => {
            expect(res.status.callCount).to.equal(1);
            expect(res.status.getCall(0).args[0]).to.equal(401);
        });

        it("Returns the expected error", () => {
            expect(res.send.callCount).to.equal(1);
            expect(res.send.getCall(0).args[0]).to.have.keys("error");
            expect(res.send.getCall(0).args[0]).to.have.property("error")
                .that.is.a("string")
                .that.equals("INVALID_AUTHORIZATION_HEADER");
        });

        it("Never called the rest of the chain", () => {
            expect(next.callCount).to.equal(0);
        });
    });

    describe("If the Seneca call returns an error", () => {
        const {res, next, seneca} = runTest({
            scopes: [],
            token: "Bearer abcdef",
            error: "Oops"
        });

        it("Returns a status of 403", () => {
            expect(res.status.callCount).to.equal(1);
            expect(res.status.getCall(0).args[0]).to.equal(403);
        });

        it("Returns the expected error", () => {
            expect(res.send.callCount).to.equal(1);
            expect(res.send.getCall(0).args[0]).to.have.keys("error");
            expect(res.send.getCall(0).args[0]).to.have.property("error")
                .that.is.a("string")
                .that.equals("Oops");
        });

        it("Called Seneca with the expected parameters", () => {
            expect(seneca.act.callCount).to.equal(1);
            const senecaCall = seneca.act.getCall(0);

            expect(senecaCall.args[0]).to.have.keys("role", "cmd", "token");
            expect(senecaCall.args[0]).to.have.property("role")
                .that.is.a("string")
                .that.equals("token");
            expect(senecaCall.args[0]).to.have.property("cmd")
                .that.is.a("string")
                .that.equals("lookup");
            expect(senecaCall.args[0]).to.have.property("token")
                .that.is.a("string")
                .that.equals("abcdef");
        });

        it("Never called the rest of the chain", () => {
            expect(next.callCount).to.equal(0);
        });
    });

    describe("If the Seneca call returns a token", () => {
        describe("When no scopes are needed", () => {
            const {res, next, seneca} = runTest({
                token: "Bearer abcdef",
                success: {
                    scopes: ["b", "c", "d"]
                }
            });

            it("Never set the status", () => {
                expect(res.status.callCount).to.equal(0);
            });

            it("Never set the payload", () => {
                expect(res.send.callCount).to.equal(0);
            });

            it("Called Seneca with the expected parameters", () => {
                expect(seneca.act.callCount).to.equal(1);
                const senecaCall = seneca.act.getCall(0);

                expect(senecaCall.args[0]).to.have.keys("role", "cmd", "token");
                expect(senecaCall.args[0]).to.have.property("role")
                    .that.is.a("string")
                    .that.equals("token");
                expect(senecaCall.args[0]).to.have.property("cmd")
                    .that.is.a("string")
                    .that.equals("lookup");
                expect(senecaCall.args[0]).to.have.property("token")
                    .that.is.a("string")
                    .that.equals("abcdef");
            });

            it("Called the rest of the chain", () => {
                expect(next.callCount).to.equal(1);
            });
        });

        describe("When all the needed scopes are present in the token", () => {
            const {res, next, seneca} = runTest({
                scopes: ["b", "c", "d"],
                token: "Bearer abcdef",
                success: {
                    scopes: ["b", "c", "d"]
                }
            });

            it("Never set the status", () => {
                expect(res.status.callCount).to.equal(0);
            });

            it("Never set the payload", () => {
                expect(res.send.callCount).to.equal(0);
            });

            it("Called Seneca with the expected parameters", () => {
                expect(seneca.act.callCount).to.equal(1);
                const senecaCall = seneca.act.getCall(0);

                expect(senecaCall.args[0]).to.have.keys("role", "cmd", "token");
                expect(senecaCall.args[0]).to.have.property("role")
                    .that.is.a("string")
                    .that.equals("token");
                expect(senecaCall.args[0]).to.have.property("cmd")
                    .that.is.a("string")
                    .that.equals("lookup");
                expect(senecaCall.args[0]).to.have.property("token")
                    .that.is.a("string")
                    .that.equals("abcdef");
            });

            it("Called the rest of the chain", () => {
                expect(next.callCount).to.equal(1);
            });
        });

        describe("When some of the needed scopes are missing", () => {
            const {res, next, seneca} = runTest({
                scopes: ["a", "b", "c"],
                token: "Bearer abcdef",
                success: {
                    scopes: ["b", "c", "d"]
                }
            });

            it("Returns a status of 403", () => {
                expect(res.status.callCount).to.equal(1);
                expect(res.status.getCall(0).args[0]).to.equal(403);
            });

            it("Returns the expected error", () => {
                expect(res.send.callCount).to.equal(1);
                const resSendCall = res.send.getCall(0);
                expect(resSendCall.args[0]).to.have.keys("error", "scopes");
                expect(resSendCall.args[0]).to.have.property("error")
                    .that.is.a("string")
                    .that.equals("UNAUTHORIZED");
                expect(resSendCall.args[0]).to.have.deep.property("scopes.required")
                    .that.is.an("array")
                    .and.has.length(3)
                    .and.has.members(["a", "b", "c"]);
                expect(resSendCall.args[0]).to.have.deep.property("scopes.missing")
                    .that.is.an("array")
                    .and.has.length(1)
                    .and.has.members(["a"]);
            });

            it("Called Seneca with the expected parameters", () => {
                expect(seneca.act.callCount).to.equal(1);
                const senecaCall = seneca.act.getCall(0);

                expect(senecaCall.args[0]).to.have.keys("role", "cmd", "token");
                expect(senecaCall.args[0]).to.have.property("role")
                    .that.is.a("string")
                    .that.equals("token");
                expect(senecaCall.args[0]).to.have.property("cmd")
                    .that.is.a("string")
                    .that.equals("lookup");
                expect(senecaCall.args[0]).to.have.property("token")
                    .that.is.a("string")
                    .that.equals("abcdef");
            });

            it("Never called the rest of the chain", () => {
                expect(next.callCount).to.equal(0);
            });
        });
    });
});
