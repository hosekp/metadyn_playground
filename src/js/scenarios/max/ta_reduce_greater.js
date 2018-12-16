"use strict";
(function () {
  var scenario = new metadyn.Scenario("TA.reduce(a>b)", 'Max');
  scenario.prepare = function () {
    var buffer = new ArrayBuffer(125000 * 4);
    var int32View = new Int32Array(buffer);
    if (!int32View.reduce) {
      this.skipReason = "cannot use TA.reduce";
      return;
    }
    for (var i = 0; i < int32View.length; i++) {
      int32View[i] = (i * 1578) % 24568;
    }
    this.data = int32View;
  };
  scenario.syncScenario = function syncTest() {
    var result = this.data.reduce(function (a, b) {
      return a < b ? b : a;
    });
    this.compareResult(result, 24566);
  };

  metadyn.TAReduceGreater = scenario;
})();
