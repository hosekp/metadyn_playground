(function () {
  /**
   * @extends {Scenario}
   * @constructor
   */
  function MathMaxTA() {
  }

  metadyn.utils.extendClass(MathMaxTA, metadyn.Scenario);

  var proto = MathMaxTA.prototype;
  proto.name = "Math.max(TA)";
  proto.repeats = 100;
  proto.prepare=function () {
    var buffer = new ArrayBuffer(125000*4);
    var int32View = new Int32Array(buffer);
    for (var i = 0; i < int32View.length; i++) {
      int32View[i] = i;
    }
    this.data = int32View;
  };
  proto.syncScenario = function syncTest() {
    this.checkResult(Math.max.apply(null,this.data),124999);
  };

  metadyn.MathMaxTA = MathMaxTA;
})();
