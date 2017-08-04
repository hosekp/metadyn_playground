/**
 *
 * @param {Scenario} scenario
 * @constructor
 */
metadyn.DrawScenario=function (scenario) {
  var mixin = {
    dim:512,
    sigma: 0.3,
    height:1,
    prepareData:function () {
      var dim=this.dim;
      var data = [];
      data.length = dim* dim;
      var height = this.height;
      var sigma = this.sigma;
      for(var i=0;i<9;i++){
        var x0=this.getX();
        var y0=this.getY();
        for (var y = 0; y < dim; y++) {
          for (var x = 0; x < dim; x++) {
            data[y * dim + x] += height * Math.exp(-(Math.pow(x / dim - x0, 2) + Math.pow(y / dim - y0, 2)) / Math.pow(sigma,2));
          }
        }
      }
      return data;
    },
    /**
     * @return {HTMLCanvasElement}
     */
    createCanvas:function () {
      // noinspection JSValidateTypes
      /** @type {HTMLCanvasElement} */
      var canvas = document.createElement("canvas");
      canvas.height=this.dim;
      canvas.width=this.dim;
      return canvas;
    }
  };
  metadyn.utils.extend(scenario, mixin);
};
