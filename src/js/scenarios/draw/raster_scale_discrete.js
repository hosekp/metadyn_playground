(function () {
  "use strict";
  var scenario = new metadyn.Scenario("Raster scale discrete", 'Draw');
  metadyn.DrawScenario(scenario);
  scenario.prepare = function () {
    /**
     *
     * @type {HTMLCanvasElement}
     */
    this.canvas = this.createCanvas();
    this.sourceData = this.prepareData(this.dim);
    // this.cscale=new Uint32Array(1000);
    this.cscale = [];
    this.cscale.length = 1001;
    for (var i = 0; i < 1001; i += 1) {
      this.cscale[i] = this.colorScale(i / 1000);
    }
  };
  scenario.syncScenario = function () {
    var dim = this.dim;
    /** @type {CanvasRenderingContext2D} */
    var ctx = this.canvas.getContext("2d");
    /** @type {ImageData} */
    var imageData = ctx.getImageData(0, 0, dim, dim);
    var width = imageData.width;
    var height = imageData.height;
    var scale = this.cscale;
    var buffer = new ArrayBuffer(width * height * 4);
    var work32 = new Uint32Array(buffer);
    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        work32[y * width + x] = scale[Math.floor(this.sourceData[y * width + x] * 1000)];
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

  metadyn.drawRasterScaleDiscrete = scenario;
})();
