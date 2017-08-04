(function () {
  var scenario = new metadyn.Scenario("Add gaussian naive", 'Add');
  metadyn.AddScenario(scenario);
  scenario.prepare = function () {
    var data = [];
    data.length = this.mainSize*this.mainSize;
    data.fill(0);
    this.data = data;
  };
  scenario.syncScenario = function syncTest() {
    var data = this.data;
    var dim = this.mainSize;
    var sigma = this.sigma;
    var x0 = this.getX();
    var y0 = this.getY();
    var height = this.getHeight();
    for (var y = 0; y < dim; y++) {
      for (var x = 0; x < dim; x++) {
        data[y * dim + x] += height * Math.exp(-(Math.pow(x / dim - x0, 2) + Math.pow(y / dim - y0, 2)) / Math.pow(sigma,2));
      }
    }
  };
  scenario.checkResult = function () {
    this.compareResult(this.data.length, this.mainSize * this.mainSize);
    this.exportCanvas(this.data);
  };
  metadyn.addGaussianNaive = scenario;
})();
