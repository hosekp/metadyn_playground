(function () {
  var scenario = new metadyn.Scenario("Add gaussian optimized", 'Add');
  metadyn.AddScenario(scenario);
  scenario.prepare = function () {
    var data = [];
    data.length = this.mainSize * this.mainSize;
    data.fill(0);
    this.data = data;
  };
  scenario.syncScenario = function syncTest() {
    var data = this.data;
    var dim = this.mainSize;
    var sigma = this.sigma;
    var x = this.getX() * dim;
    var y = this.getY() * dim;
    var height = this.getHeight();
    var dimSigma2 = sigma * sigma * dim * dim;
    for (var i = 0; i < dim; i++) {
      var ix2 = (i - x) * (i - x);
      var deltaX = i*dim;
      for (var j = 0; j < dim; j++) {
        data[deltaX + j] += height * Math.exp(-(ix2 + Math.pow(j - y, 2)) / dimSigma2);
      }
    }
  };
  scenario.checkResult = function () {
    this.compareResult(this.data.length, this.mainSize * this.mainSize);
    this.exportCanvas(this.data);
  };
  metadyn.addGaussianOptimized = scenario;
})();
