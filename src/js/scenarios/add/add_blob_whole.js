(function () {
  var scenario = new metadyn.Scenario("Add blob whole", 'Add');
  scenario.prepare = function () {
    var data = [];
    data.length = 500000;
    data.fill(0);
    this.data = data;
    var blob = [];
    var blobSize = 50000;
    var h = 20;
    var sigma = 30;
    var x0 = Math.floor(blobSize / 2);
    for (var i = 0; i < blobSize; i++) {
      blob.push(h * Math.exp(-(i - x0) * (i - x0) / sigma / sigma));
    }
    this.blob = blob;
  };
  scenario.syncScenario = function syncTest() {
    var data = this.data;
    var blob = this.blob;
    var shift = 200000;
    for (var i = 0; i < blob.length; i++) {
      data[shift + i] = blob[i];
    }
  };
  metadyn.addBlobWhole = scenario;
})();
