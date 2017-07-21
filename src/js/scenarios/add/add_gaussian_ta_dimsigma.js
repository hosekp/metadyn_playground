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
    var x = this.getX()*dim;
    var y = this.getY()*dim;
    var dimSigma2 = sigma*sigma*dim*dim;
    var height = this.getHeight();
    for (var i = 0; i < dim; i++) {
      for (var j = 0; j < dim; j++) {
        data[i * dim + j] += height * Math.exp(-(Math.pow(i - x, 2) + Math.pow(j - y, 2)) / dimSigma2);
      }
    }
  };
  scenario.checkResult = function () {
    this.compareResult(this.data.length, this.mainSize * this.mainSize);
    this.exportCanvas(this.data);
  };
  metadyn.addGaussianTaDimSigma = scenario;
})();
