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
    this.sourceData = this.prepareData();
  };
  scenario.syncScenario = function () {
    var dim = this.dim;
    /** @type {CanvasRenderingContext2D} */
    var ctx = this.canvas.getContext("2d");
    /** @type {ImageData} */
    var imageData = ctx.getImageData(0,0,dim,dim);
    for(var i=0;i<dim*dim;i++){

    }
  }
})();
