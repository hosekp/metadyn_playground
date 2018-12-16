"use strict";
(function () {
  var scenario = new metadyn.Scenario("[].reduce(a>b)", 'Max');
  scenario.prepare = function () {
    var data = [];
    for (var i = 0; i < 125000; i++) {
      data.push((i * 1578) % 24568);
    }
    this.data = data;
  };
  scenario.syncScenario = function syncTest() {
    var result = this.data.reduce(function (a, b) {
      return a < b ? b : a;
    });
    this.compareResult(result, 24566);
  };

  metadyn.reduceGreater = scenario;
})();
