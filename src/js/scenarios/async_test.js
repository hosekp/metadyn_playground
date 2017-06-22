(function () {
  /**
   * @extends {Scenario}
   * @constructor
   */
  function AsyncTest() {
  }

  metadyn.utils.extendClass(AsyncTest, metadyn.Scenario);

  var proto = AsyncTest.prototype;
  proto.name = "Async test";
  proto.repeats = 3;
  proto.asyncScenario = function asyncTest(callback) {
    setTimeout(function () {
      callback()
    }, 1000);
  };

  metadyn.AsyncTest = AsyncTest;
})();
