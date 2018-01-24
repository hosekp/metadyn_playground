"use strict";
(function () {
  var scenario = new metadyn.Scenario("Raster int32", 'Draw');
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
    var width = imageData.width;
    var height = imageData.height;
    var buffer = new ArrayBuffer(width * height * 4);
    var work32 = new Uint32Array(buffer);
    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        work32[y * width + x] = this.colorScale(this.sourceData[y * width + x]);
      }
    }
    imageData.data.set(new Uint8ClampedArray(buffer));
    ctx.putImageData(imageData, 0, 0);
  };
  scenario.colorScale = function (d) {
    var sigma = 1000.0, hei = 380.0;
    return (255 << 24) |
        (Math.min(Math.max(hei - Math.abs(d - 0.77) * sigma, 0.0), 255.0) << 16) |
        (Math.min(Math.max(hei - Math.abs(d - 0.49) * sigma, 0.0), 255.0) << 8) |
        Math.min(Math.max(hei - Math.abs(d - 0.23) * sigma, 0.0), 255.0);
  };
  scenario.split = function (c) {
    var buffer = new ArrayBuffer(4);
    var work32 = new Uint32Array(buffer);
    work32[0]=c;
    return Array.from(new Uint8ClampedArray(buffer));
  };

  metadyn.drawRasterInt32 = scenario;
})();
