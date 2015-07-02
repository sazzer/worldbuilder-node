import {assert, expect} from "chai";
import {hello} from "hello";

describe("Hello", () => {
    it("Should return Hello", () => {
        expect(hello()).to.equal("Hello");
    });
});

describe("Array", function(){
  describe("#indexOf()", function(){
    it("should return -1 when the value is not present", function(){
      expect([1, 2, 3].indexOf(5)).to.equal(-1);
      assert.equal(-1, [1, 2, 3].indexOf(0));
    });
  });
});
