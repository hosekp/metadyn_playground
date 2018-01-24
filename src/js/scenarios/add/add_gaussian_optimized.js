"use strict";
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
    var x0 = this.getX() * dim;
    var y0 = this.getY() * dim;
    var height = this.getHeight();
    var dimSigma2 = sigma * sigma * dim * dim;
    for (var y = 0; y < dim; y++) {
      var yy02 = (y - y0) * (y - y0);
      var deltaX = y * dim;
      for (var x = 0; x < dim; x++) {
        data[deltaX + x] += height * Math.exp(-(Math.pow(x - x0, 2) + yy02) / dimSigma2);
      }
    }
  };
  scenario.checkResult = function () {
    this.compareResult(this.data.length, this.mainSize * this.mainSize);
    this.exportCanvas(this.data);
  };
  metadyn.addGaussianOptimized = scenario;
})();
