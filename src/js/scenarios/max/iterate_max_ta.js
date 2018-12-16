"use strict";
(function () {
  var scenario = new metadyn.Scenario("for([]) if TA", 'Max');
  scenario.prepare = function () {
    var buffer = new ArrayBuffer(125000 * 4);
    var int32View = new Int32Array(buffer);
    for (var i = 0; i < int32View.length; i++) {
      int32View[i] = (i * 1578) % 24568;
    }
    this.data = int32View;
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
  metadyn.iterateMaxTA = scenario;
})();
