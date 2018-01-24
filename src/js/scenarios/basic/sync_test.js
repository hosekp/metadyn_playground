"use strict";
(function () {
  var scenario = new metadyn.Scenario("Sync test", 'Basic');
  scenario.prepare = function () {
    this.data=[];
  };
  scenario.syncScenario = function syncTest() {
    var result = 0;
    for (var i = 0; i < 1000; i++) {
      result += i;
    }
  };
  metadyn.syncTest = scenario;
})();
