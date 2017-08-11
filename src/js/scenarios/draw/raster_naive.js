(function () {
  "use strict";
  var scenario = new metadyn.Scenario("Raster naive", 'Draw');
  metadyn.DrawScenario(scenario);
  scenario.prepare = function () {
    /**
     *
     * @type {HTMLCanvasElement}
     */
    this.canvas = this.createCanvas();
    this.sourceData = this.prepareData(this.dim);
  };
  scenario.syncScenario = function () {
    var dim = this.dim;
    /** @type {CanvasRenderingContext2D} */
    var ctx = this.canvas.getContext("2d");
    /** @type {ImageData} */
    var imageData = ctx.getImageData(0, 0, dim, dim);
    var dataImageData = imageData.data;
    var width = imageData.width;
    var height = imageData.height;
    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        var color = this.colorScale(this.sourceData[y * width + x]);
        for (var i = 0; i < 4; i++) {
          dataImageData[4*y * width + x * 4 + i] = color[i];
        }
      }
    }
    ctx.putImageData(imageData, 0, 0);
  };
  scenario.colorScale = function (d) {
    var sigma = 1000.0, hei = 380.0;
    return [
      Math.min(Math.max(Math.floor(hei - Math.abs(d - 0.23) * sigma), 0), 255),
      Math.min(Math.max(Math.floor(hei - Math.abs(d - 0.49) * sigma), 0), 255),
      Math.min(Math.max(Math.floor(hei - Math.abs(d - 0.77) * sigma), 0), 255),
      255
    ]
  };

  metadyn.drawRasterNaive = scenario;
})();
