(function () {
  var scenario = new metadyn.Scenario("Async test",30,'Basic');
  scenario.asyncScenario = function asyncTest(callback) {
    setTimeout(function () {
      callback()
    }, 100);
  };
  /**
   *
   * @type {Scenario}
   */
  metadyn.asyncTest = scenario;
})();
