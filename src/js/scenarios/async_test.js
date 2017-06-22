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
  proto.repeats = 30;
  proto.asyncScenario = function asyncTest(callback) {
    setTimeout(function () {
      callback()
    }, 100);
  };

  metadyn.AsyncTest = AsyncTest;
})();
