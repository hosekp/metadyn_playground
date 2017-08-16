(function () {
  "use strict";
  var scenario = new metadyn.Scenario("Raster 4 rimmed", 'Draw');
  metadyn.DrawScenario(scenario);
  scenario.prepare = function () {
    /**
     *
     * @type {HTMLCanvasElement}
     */
    this.canvas = this.createCanvas();
    this.sourceData = this.prepareData(this.dataDim);
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
    var buffer = this.draw(this.sourceData, 1);
    imageData.data.set(new Uint8ClampedArray(buffer));

    ctx.putImageData(imageData, 0, 0);
  };
  scenario.draw = function (array, zmax) {
    var resolution, innerResolution, graphicPixelWidth, graphicPixelHeight, imageHeight, imageWidth,
        graphicHeightIterator, graphicWidthIterator, graphicWidthBottomLimit, graphicHeightBottomLimit = 0,
        dataWidthRest, dataHeigthRest, h0w0, h0w1, h1w0, h1w1, dataWidthIterator, dataHeightIterator,
        dinter, inter0, sumhw, mainDataIterator = 0, work32OffsetByHeight, graphicWidthTopLimit, graphicHeightTopLimit;
    imageWidth = this.dim;
    imageHeight = this.dim;
    var buffer = new ArrayBuffer(imageWidth * imageHeight * 4);
    var work32 = new Uint32Array(buffer);
    resolution = this.dataDim;
    if (!zmax) {
      zmax = 1;
    }
    innerResolution = resolution - 1;
    graphicPixelWidth = imageWidth / resolution; // width of 1 computational px in drawing pxs
    graphicPixelHeight = imageHeight / resolution; // height of 1 computational px in drawing pxs
    h0w1 = array[mainDataIterator] / zmax;
    h1w1 = array[mainDataIterator + resolution] / zmax;
    for (dataHeightIterator = 0; dataHeightIterator < innerResolution; dataHeightIterator += 1) {
      graphicWidthBottomLimit = 0;
      for (dataWidthIterator = 0; dataWidthIterator < innerResolution; dataWidthIterator += 1) {
        h0w0 = h0w1;
        h1w0 = h1w1;
        h0w1 = array[mainDataIterator + 1] / zmax;
        h1w1 = array[mainDataIterator + 1 + resolution] / zmax;
        // console.log({
        //   h0w0:h0w0,
        //   h1w0:h1w0,
        //   h0w1:h0w1,
        //   h1w1:h1w1
        // });
        sumhw = h0w0 - h0w1 - h1w0 + h1w1;
        graphicHeightTopLimit = (dataHeightIterator + 1) * graphicPixelHeight;
        if (dataHeightIterator === innerResolution-1) {
          graphicHeightTopLimit += graphicPixelHeight;
        }
        for (graphicHeightIterator = graphicHeightBottomLimit; graphicHeightIterator < graphicHeightTopLimit; graphicHeightIterator += 1) {
          dataHeigthRest = graphicHeightIterator / graphicPixelHeight - dataHeightIterator;
          // work32OffsetByHeight = (imageHeight - graphicHeightIterator) * imageWidth;
          work32OffsetByHeight = graphicHeightIterator * imageWidth;
          inter0 = (h0w0 * (1 - dataHeigthRest) + h1w0 * dataHeigthRest) * 1000;
          dinter = (h0w1 - h0w0 + dataHeigthRest * sumhw) * 1000;
          graphicWidthTopLimit = (dataWidthIterator + 1) * graphicPixelWidth;
          if (dataWidthIterator === innerResolution-1) {
            graphicWidthTopLimit += graphicPixelWidth;
          }
          for (graphicWidthIterator = graphicWidthBottomLimit; graphicWidthIterator < graphicWidthTopLimit; graphicWidthIterator += 1) {
            dataWidthRest = graphicWidthIterator / graphicPixelWidth - dataWidthIterator;
            // var scalePos = Math.floor(inter0 + dinter * dataWidthRest);
            // console.log({
            //   // inter0:inter0,
            //   // dinter:dinter,
            //   // sumhw:sumhw,
            //   // dataHeightRest:dataHeigthRest,
            //   // dataWidthRest:dataWidthRest,
            //   cscale:Math.floor(inter0 + dinter * dataWidthRest)/1000,
            //   shift:graphicWidthIterator + work32OffsetByHeight
            // });
            work32[graphicWidthIterator + work32OffsetByHeight] = this.cscale[Math.floor(inter0 + dinter * dataWidthRest)];
          }
        }
        mainDataIterator += 1;
        graphicWidthBottomLimit = graphicWidthIterator;
      }
      mainDataIterator += 1;
      h0w1 = array[mainDataIterator] / zmax;
      h1w1 = array[mainDataIterator + resolution] / zmax;
      graphicHeightBottomLimit = graphicHeightIterator;
    }
    // console.log(JSON.stringify(this.parse32(work32)));
    return buffer;
  };
  scenario.colorScale = function (d) {
    var sigma = 1000.0, hei = 380.0;
    return (255 << 24) |
        (Math.min(Math.max(hei - Math.abs(d - 0.77) * sigma, 0.0), 255.0) << 16) |
        (Math.min(Math.max(hei - Math.abs(d - 0.49) * sigma, 0.0), 255.0) << 8) |
        Math.min(Math.max(hei - Math.abs(d - 0.23) * sigma, 0.0), 255.0);
  };

  metadyn.drawRaster4Rimmed = scenario;
})();
