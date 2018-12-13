"use strict";
(function () {
  var scenario = new metadyn.Scenario("for([]) if", 'Max');
  scenario.prepare = function () {
    var data = [];
    for (var i = 0; i < 125000; i++) {
      data.push(i);
    }
    this.data = data;
  };
  scenario.syncScenario = function syncTest() {
    var max = -Infinity;
    var data = this.data;
    for (var i = 0; i < data.length; i++) {
      if (data[i] > max) {
        max = data[i];
      }
    }
    this.checkResult(max, 124999);
  };
  metadyn.iterateMax = scenario;
})();
