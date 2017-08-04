"use strict";
(function () {
  var scenario = new metadyn.Scenario("Async test", 'Basic');
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
  scenario.asyncPrepare = function (callback) {
    setTimeout(callback, 100);
  };
  /**
   *
   * @type {Scenario}
   */
  metadyn.asyncTest = scenario;
})();
