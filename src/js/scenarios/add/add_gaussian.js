(function () {
  var scenario = new metadyn.Scenario("Add gaussian", 'Add');
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
      data[i] = h * Math.exp(-Math.pow(i - x0,2) / Math.pow(sigma,2));
    }
  };
  metadyn.addGaussian = scenario;
})();
