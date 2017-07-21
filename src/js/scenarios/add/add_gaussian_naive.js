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
    var x = this.getX();
    var y = this.getY();
    var height = this.getHeight();
    for (var i = 0; i < dim; i++) {
      for (var j = 0; j < dim; j++) {
        data[i * dim + j] += height * Math.exp(-(Math.pow(i / dim - x, 2) + Math.pow(j / dim - y, 2)) / Math.pow(sigma,2));
      }
    }
  };
  scenario.checkResult = function () {
    this.compareResult(this.data.length, this.mainSize * this.mainSize);
    this.exportCanvas(this.data);
  };
  metadyn.addGaussianNaive = scenario;
})();
