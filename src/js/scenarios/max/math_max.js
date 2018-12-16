"use strict";
(function () {
  var scenario = new metadyn.Scenario("Math.max([])", 'Max');
  scenario.prepare = function () {
    var data = [];
    for (var i = 0; i < 125000; i++) {
      data.push((i*1578)%24568);
    }
    this.data = data;
  };
  scenario.syncScenario = function syncTest() {
    this.compareResult(Math.max.apply(null, this.data),24566);
  };
  metadyn.mathMaxArray = scenario;
})();
