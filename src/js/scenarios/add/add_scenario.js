"use strict";
/**
 *
 * @param scenario
 * @constructor
 */
metadyn.AddScenario = function (scenario) {
  /** @mixin */
  var AddScenario = {
    mainSize: 512,
    blobSize: 512,
    sigma: 0.1,
    comparable: true,
    wholeSeedCycle: 9,
    /**
     *
     * @param {Array.<number>} data
     * @param {int} dim
     * @param {number} [height]
     * @return {Array.<number>}
     */
    populateBlob: function (data, dim, height) {
      height = height || 1;
      var i, j;
      var x = Math.floor(dim / 2);
      var dimSigma2 = this.sigma * this.sigma * dim * dim;
      if (data.length !== dim * dim) {
        data.length = dim * dim;
      }
      for (i = 0; i < dim; i++) {
        for (j = 0; j < dim; j++) {
          data[dim * i + j] = height * Math.exp(-(Math.pow(i - x, 2) + Math.pow(j - x, 2)) / dimSigma2);
        }
      }
      return data;
    },
    exportCanvas: function (data) {
      var dim = this.mainSize;
      var canvas = this.prepareExportCanvas(dim);
      var ctx = canvas.getContext("2d");
      var imageData = ctx.getImageData(0, 0, dim, dim);
      var max = metadyn.utils.findMaxMin(data)[0];
      var int32array = new Uint32Array(data.length);
      for (var i = 0; i < data.length; i++) {
        int32array[i] = this.colorScale(data[i]/max);
      }
      imageData.data.set(new Uint8Array(int32array.buffer));
      ctx.putImageData(imageData, 0, 0);
      document.getElementById("image_cont").appendChild(canvas);
    },
    colorScale: function (d) {
      var sigma = 1000.0, hei = 380.0;
      return (255 << 24) |
          (Math.min(Math.max(hei - Math.abs(d - 0.77) * sigma, 0.0), 255.0) << 16) |
          (Math.min(Math.max(hei - Math.abs(d - 0.49) * sigma, 0.0), 255.0) << 8) |
          Math.min(Math.max(hei - Math.abs(d - 0.23) * sigma, 0.0), 255.0);
    }
  };
  metadyn.utils.extend(scenario, AddScenario);
};
