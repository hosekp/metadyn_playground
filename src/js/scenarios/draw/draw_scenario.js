"use strict";
/**
 *
 * @param {Scenario} scenario
 * @constructor
 */
metadyn.DrawScenario = function (scenario) {
  var mixin = {
    dim: 512,
    dataDim:128,
    sigma: 0.1,
    height: 1,
    comparable: true,
    /**
     *
     * @param {int} dim
     * @return {Array}
     */
    prepareData: function (dim) {
      // return this.prepareRasterData(dim);
      var data = [];
      data.length = dim * dim;
      metadyn.utils.fillArray(data, 0);
      var height = this.height;
      var sigma = this.sigma;
      for (var i = 0; i < 9; i++) {
        var x0 = this.getX() - 0.5 / dim;
        var y0 = this.getY() - 0.5 / dim;
        for (var y = 0; y < dim; y++) {
          for (var x = 0; x < dim; x++) {
            data[y * dim + x] += height * Math.exp(-(Math.pow(x / dim - x0, 2) + Math.pow(y / dim - y0, 2)) / Math.pow(sigma, 2));
          }
        }
      }
      var maximal = metadyn.utils.findMaxMin(data)[0];
      for (i = 0; i < data.length; i++) {
        data[i] /= maximal;
      }
      return data;
    },
    prepareRasterData: function (dim) {
      var data = [];
      data.length = dim * dim;
      metadyn.utils.fillArray(data, 0);
      for (var y = 0; y < dim; y++) {
        for (var x = 0; x < dim; x++) {
          data[y * dim + x] = 0.1 + (x % 2) * 0.3 + (y % 2) * 0.2 + x / dim * 0.25 + y / dim * 0.15;
        }
      }
      return data;
    },
    exportCanvas: function (canvas) {
      var canvasCopy = this.prepareExportCanvas(this.dim);
      var ctx = canvasCopy.getContext("2d");
      ctx.drawImage(canvas, 0, 0);
      document.getElementById("image_cont").appendChild(canvasCopy);
    },
    checkResult: function () {
      this.exportCanvas(this.canvas);
    },
    getResult: function () {
      return this.canvas.getContext("2d").getImageData(0, 0, this.dim, this.dim).data;
    },
    parse32: function (array32) {
      var array8 = [];
      for (var i = 0; i < array32.length; i++) {
        var fourByte = [0, 0, 0, 0];
        var int32 = array32[i];
        for (var j = 0; j < 4; j++) {
          fourByte[4 - j] = int32 % 255;
          int32 = Math.floor(int32 / 255);
        }
        array8.push(fourByte);
      }
      return array8;
    }
  };
  metadyn.utils.extend(scenario, mixin);
};
