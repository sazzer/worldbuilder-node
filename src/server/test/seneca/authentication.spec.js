/* eslint-env mocha */
import {expect} from "chai";
import sinon from "sinon";
import {authenticated} from "seneca/authentication";

describe("seneca/authentication", () => {

    describe("When no scopes are needed", () => {
        const middleware = authenticated([]);

        describe("If no header is provided", () => {
            const req = {
                header: sinon.stub().withArgs("Authorization")
                    .returns(null)
            };

            const res = {};

            res.status = sinon.stub().returnsThis();
            res.send = sinon.stub().returnsThis();

            const next = sinon.spy();

            middleware(req, res, next);

            it("Returns a status of 403", () => {
                expect(res.status.callCount).to.equal(1);
                expect(res.status.getCall(0).args[0]).to.equal(401);
            });

            it("Returns the expected error", () => {
                expect(res.send.callCount).to.equal(1);
                expect(res.send.getCall(0).args[0]).to.have.keys("error");
                expect(res.send.getCall(0).args[0]).to.have.property("error", "NO_AUTHORIZATION_HEADER");
            });

            it("Never called the rest of the chain", () => {
                expect(next.callCount).to.equal(0);
            });
        });

        describe("If a header that isn't a Bearer is provided", () => {
            const req = {
                header: sinon.stub().withArgs("Authorization")
                    .returns("abcdef")
            };

            const res = {};

            res.status = sinon.stub().returnsThis();
            res.send = sinon.stub().returnsThis();

            const next = sinon.spy();

            middleware(req, res, next);

            it("Returns a status of 403", () => {
                expect(res.status.callCount).to.equal(1);
                expect(res.status.getCall(0).args[0]).to.equal(401);
            });

            it("Returns the expected error", () => {
                expect(res.send.callCount).to.equal(1);
                expect(res.send.getCall(0).args[0]).to.have.keys("error");
                expect(res.send.getCall(0).args[0]).to.have.property("error", "INVALID_AUTHORIZATION_HEADER");
            });

            it("Never called the rest of the chain", () => {
                expect(next.callCount).to.equal(0);
            });
        });
    });
});
