(function () {
  var scenario = new metadyn.Scenario("Add gaussian optimized", 1000, 'Add');
  scenario.prepare = function () {
    var data = [];
    data.length = 50000;
    data.fill(0);
    this.data = data;
  };
  scenario.syncScenario = function syncTest() {
    var data = this.data;
    var h = 20;
    var sigma = 30;
    var x0 = Math.floor(data.length / 2);
    for (var i = 0; i<data.length; i++) {
      data[i] = h * Math.exp(-(i - x0) * (i - x0) / sigma / sigma);
    }
  };
  metadyn.addGaussianOptimized = scenario;
})();
