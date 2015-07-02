import {assert, expect, should} from "chai";
should();

describe("Array", function(){
  describe("#indexOf()", function(){
    it("should return -1 when the value is not present", function(){
      expect([1, 2, 3].indexOf(5)).to.equal(-1);
      [1, 2, 3].indexOf(2).should.equal(1);
      assert.equal(-1, [1, 2, 3].indexOf(0));
    });
  });
});
