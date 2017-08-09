(function () {
  var scenario = new metadyn.Scenario("Add gaussian TA naive", 'Add');
  metadyn.AddScenario(scenario);
  scenario.prepare = function () {
    var int32View = new Float32Array(this.mainSize * this.mainSize);
    int32View.fill(0);
    this.data = int32View;
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
        data[y * dim + x] += height * Math.exp(-(Math.pow(x / dim - x0, 2) + Math.pow(y / dim - y0, 2)) / sigma / sigma);
      }
    }
  };
  scenario.checkResult = function () {
    this.compareResult(this.data.length, this.mainSize * this.mainSize);
    this.exportCanvas(this.data);
  };
  metadyn.addGaussianTaNaive = scenario;
})();
