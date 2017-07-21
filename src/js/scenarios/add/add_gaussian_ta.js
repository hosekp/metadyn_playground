(function () {
  var scenario = new metadyn.Scenario("Add gaussian TA", 'Add');
  scenario.prepare = function () {
    var buffer = new ArrayBuffer(50000*4);
    var int32View = new Float32Array(buffer);
    for (var i = 0; i < int32View.length; i++) {
      int32View[i] = i;
    }
    this.data = int32View;
  };
  scenario.syncScenario = function syncTest() {
    var data = this.data;
    var h = 20;
    var sigma = 30;
    var x0 = Math.floor(data.length / 2);
    for (var i = 0; i<data.length; i++) {
      data[i] = h * Math.exp(-(i - x0) * (i - x0) / sigma / sigma);
    }
    this.checkResult(data.length,50000);
  };
  metadyn.addGaussianTa = scenario;
})();
