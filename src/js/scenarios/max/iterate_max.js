"use strict";
(function () {
  var scenario = new metadyn.Scenario("for([]) if", 'Max');
  scenario.prepare = function () {
    var data = [];
    for (var i = 0; i < 125000; i++) {
      data.push((i*1578)%24568);
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
    this.compareResult(max, 24566);
  };
  metadyn.iterateMax = scenario;
})();
