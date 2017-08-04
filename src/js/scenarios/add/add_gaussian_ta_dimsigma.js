(function () {
  var scenario = new metadyn.Scenario("Add gaussian TA dimSigma", 'Add');
  metadyn.AddScenario(scenario);
  scenario.prepare = function () {
    var int32View = new Float32Array(this.mainSize * this.mainSize);
    for (var i = 0; i < int32View.length; i++) {
      int32View[i] = 0;
    }
    this.data = int32View;
  };
  scenario.syncScenario = function syncTest() {
    var data = this.data;
    var dim = this.mainSize;
    var sigma = this.sigma;
    var x0 = this.getX()*dim;
    var y0 = this.getY()*dim;
    var dimSigma2 = sigma*sigma*dim*dim;
    var height = this.getHeight();
    for (var y = 0; y < dim; y++) {
      for (var x = 0; x < dim; x++) {
        data[y * dim + x] += height * Math.exp(-(Math.pow(x - x0, 2) + Math.pow(y - y0, 2)) / dimSigma2);
      }
    }
  };
  scenario.checkResult = function () {
    this.compareResult(this.data.length, this.mainSize * this.mainSize);
    this.exportCanvas(this.data);
  };
  metadyn.addGaussianTaDimSigma = scenario;
})();
