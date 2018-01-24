"use strict";
(function () {
  var scenario = new metadyn.Scenario("Math.max(TA)", 'Max');
  scenario.prepare = function () {
    var buffer = new ArrayBuffer(125000 * 4);
    var int32View = new Int32Array(buffer);
    for (var i = 0; i < int32View.length; i++) {
      int32View[i] = i;
    }
    this.data = int32View;
  };
  scenario.syncScenario = function syncTest() {
    this.checkResult(Math.max.apply(null, this.data), 124999);
  };

  metadyn.mathMaxTA = scenario;
})();
