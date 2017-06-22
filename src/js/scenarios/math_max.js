(function () {
  /**
   * @extends {Scenario}
   * @constructor
   */
  function MathMaxArray() {
  }

  metadyn.utils.extendClass(MathMaxArray, metadyn.Scenario);

  var proto = MathMaxArray.prototype;
  proto.name = "Math.max([])";
  proto.repeats = 100;
  proto.prepare=function () {
    var data=[];
    for(var i=0;i<125000;i++){
      data.push(i);
    }
    this.data = data;
  };
  proto.syncScenario = function syncTest() {
    this.checkResult(Math.max.apply(null,this.data),124999);
  };

  metadyn.MathMaxArray = MathMaxArray;
})();
