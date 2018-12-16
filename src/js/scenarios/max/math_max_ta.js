"use strict";
(function () {
  var scenario = new metadyn.Scenario("Math.max(TA)", 'Max');
  scenario.prepare = function () {
    var buffer = new ArrayBuffer(125000 * 4);
    var int32View = new Int32Array(buffer);
    for (var i = 0; i < int32View.length; i++) {
      int32View[i] = (i * 1578) % 24568;
    }
    this.data = int32View;
  };
  scenario.syncScenario = function syncTest() {
    this.compareResult(Math.max.apply(null, this.data), 24566);
  };

  metadyn.mathMaxTA = scenario;
})();
