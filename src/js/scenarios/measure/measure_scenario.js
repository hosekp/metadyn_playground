"use strict";
/**
 *
 * @param scenario
 * @constructor
 */
metadyn.MeasureScenario = function (scenario) {
  /** @mixin */
  var MeasureScenario = {
    size: 512,
    sigma: 0.1,
    comparable: true,
    prepareData: function (dim, height) {
      var array = new Float32Array(dim * dim);
      height = height || 1;
      array.fill(0);
      var i, j;
      var blobs = [];
      var dimSigma2 = this.sigma * this.sigma * dim * dim;
      for (var b = 0; b < 9; b++) {
        var x = this.getX();
        var y = this.getY();
        blobs.push([[x, y]]);
        x*=dim;
        y*=dim;
        for (i = 0; i < dim; i++) {
          for (j = 0; j < dim; j++) {
            array[dim * i + j] += height * Math.exp(-(Math.pow(i - x, 2) + Math.pow(j - y, 2)) / dimSigma2);
          }
        }
      }
      this.data = array;

      this.targetResult = blobs;
    },
    exportCanvas: function (data) {
      var dim = this.size;
      var canvas = this.prepareExportCanvas(dim);
      var ctx = canvas.getContext("2d");
      var imageData = ctx.getImageData(0, 0, dim, dim);
      var max = metadyn.utils.findMaxMin(data)[0];
      var int32array = new Uint32Array(data.length);
      for (var i = 0; i < data.length; i++) {
        int32array[i] = this.colorScale(data[i] / max);
      }
      imageData.data.set(new Uint8Array(int32array.buffer));
      ctx.putImageData(imageData, 0, 0);
      document.getElementById("image_cont").appendChild(canvas);
    },
    checkResult: function () {
      // this.compareResult(this.result.length, this.targetResult.length);
      this.exportCanvas(this.data);
    },
    getResult:function () {
      var sorted = [].concat.apply([],this.result);
      sorted.sort(function (a,b) {
        return a[0]-b[0] || a[1] - b[1];
      });
      return [].concat.apply([],sorted);
    }
  };
  metadyn.utils.extend(scenario, MeasureScenario);
};
