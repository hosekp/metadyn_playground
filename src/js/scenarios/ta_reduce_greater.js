(function () {
  /**
   * @extends {Scenario}
   * @constructor
   */
  function TAReduceGreater() {
  }

  metadyn.utils.extendClass(TAReduceGreater, metadyn.Scenario);

  var proto = TAReduceGreater.prototype;
  proto.name = "TA.reduce(a>b)";
  proto.repeats = 100;
  proto.prepare = function () {
    var buffer = new ArrayBuffer(125000 * 4);
    var int32View = new Int32Array(buffer);
    for (var i = 0; i < int32View.length; i++) {
      int32View[i] = i;
    }
    this.data = int32View;
  };
  proto.syncScenario = function syncTest() {
    var result = this.data.reduce(function (a, b) {
      return a < b ? b : a;
    });
    this.checkResult(result, 124999);
  };

  metadyn.TAReduceGreater = TAReduceGreater;
})();
