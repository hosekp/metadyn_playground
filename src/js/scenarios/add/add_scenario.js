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
      var canvas = document.createElement("canvas");
      canvas.setAttribute("title", this.name);
      canvas.setAttribute("width", dim.toString());
      canvas.setAttribute("height", dim.toString());
      canvas.style.width = "50px";
      canvas.style.height = "50px";
      var ctx = canvas.getContext("2d");
      var imageData = ctx.getImageData(0, 0, dim, dim);
      var imageArray = imageData.data;
      var max = metadyn.utils.findMaxMin(data)[0];
      for (var i = 0; i < data.length; i++) {
        imageArray[i * 4] = 255;
        imageArray[i * 4 + 1] = Math.floor(255 - data[i] / max * 255);
        imageArray[i * 4 + 2] = Math.floor(255 - data[i] / max * 255);
        imageArray[i * 4 + 3] = 255;
      }
      ctx.putImageData(imageData, 0, 0);
      document.getElementById("image_cont").appendChild(canvas);
    }
  };
  metadyn.utils.extend(scenario, AddScenario);
};
