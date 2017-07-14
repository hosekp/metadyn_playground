"use strict";
(function () {
  var scenario = new metadyn.Scenario("Async test", 30, 'Basic');
  scenario.asyncScenario = function asyncTest(callback) {
    var promise1 = new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve()
      }, 100);
    });
    var promise2 = new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve()
      }, 100);
    });
    Promise.all([promise1, promise2]).then(callback);

  };
  /**
   *
   * @type {Scenario}
   */
  metadyn.asyncTest = scenario;
})();
