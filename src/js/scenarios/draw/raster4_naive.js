"use strict";
(function () {
  var scenario = new metadyn.Scenario("Raster 4 naive", 'Draw');
  metadyn.DrawScenario(scenario);
  scenario.prepare = function () {
    /**
     *
     * @type {HTMLCanvasElement}
     */
    this.canvas = this.createCanvas();
    this.sourceData = this.prepareData(this.dataDim);
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
    var resol, resol1, gw, gh, hei, wid,
        wh, ww, hww, hwh = 0, iw, ih, h0w0, h0w1, h1w0, h1w1, sw, sh,
        dinter, inter0, sumhw, fr = 0, whxwi, wwl, whl,
        sett, zoompow, posx, posy;
    //this.profiler.init();
    wid = this.dim;
    hei = this.dim;
    var buffer = new ArrayBuffer(wid * hei * 4);
    var work32 = new Uint32Array(buffer);
    resol = this.dataDim;
    /*if(false){
     resol=10;
     array=new Float32Array(resol*resol);
     for(j=0;j<resol;j+=1){
     for(i=0;i<resol;i+=1){
     array[j*resol+i]=j+i;
     }
     }
     zmax=(resol-1)*2;
     }*/
    //manage.console.debug("zmax="+zmax);
    if (!zmax) {
      zmax = 1;
    }
    resol1 = resol - 1;
    gw = wid / resol1; // width of 1 computational px in drawing pxs
    gh = hei / resol1; // height of 1 computational px in drawing pxs
    //this.profiler.time(1);
    h0w1 = array[fr] / zmax;
    h1w1 = array[fr + resol] / zmax;
    for (sh = 0; sh < resol1; sh += 1) {
      hww = 0;
      for (sw = 0; sw < resol1; sw += 1) {
        h0w0 = h0w1;
        h1w0 = h1w1;
        h0w1 = array[fr + 1] / zmax;
        h1w1 = array[fr + 1 + resol] / zmax;
        whl = (sh + 1) * gh;
        for (wh = hwh; wh < whl; wh += 1) {
          ih = wh / gh - sh;
          wwl = (sw + 1) * gw;
          for (ww = hww; ww < wwl; ww += 1) {
            iw = ww / gw - sw;
            var d = h0w0 + (h1w0 - h0w0) * ih + (h0w1 - h0w0) * iw + (h0w0 - h0w1 - h1w0 + h1w1) * iw * ih;
            work32[ww + wh * wid] = this.colorScale(d);
          }
        }
        fr += 1;
        hww = ww;
      }
      fr += 1;
      h0w1 = array[fr] / zmax;
      h1w1 = array[fr + resol] / zmax;
      hwh = wh;
    }
    return buffer;
  };
  scenario.colorScale = function (d) {
    var sigma = 1000.0, hei = 380.0;
    return (255 << 24) |
        (Math.min(Math.max(hei - Math.abs(d - 0.77) * sigma, 0.0), 255.0) << 16) |
        (Math.min(Math.max(hei - Math.abs(d - 0.49) * sigma, 0.0), 255.0) << 8) |
        Math.min(Math.max(hei - Math.abs(d - 0.23) * sigma, 0.0), 255.0);
  };

  metadyn.drawRaster4Naive = scenario;
})();
