(function () {
  var scenario = new metadyn.Scenario("Add blob 1:1", 'Add');
  metadyn.AddScenario(scenario);
  scenario.prepare = function () {
    this.data = this.prepareDataArray(this.mainSize);
    this.blob = this.populateBlob([], this.blobSize);
  };
  scenario.syncScenario = function syncTest() {
    var blob = this.blob;
    var x = this.getX();
    var y = this.getY();
    var height = this.getHeight();
    this.blobAdd([x, y, height], {data: blob});
  };
  /**
   *
   * @param {Array.<number>} inds
   * @param {*} blob
   * @return {Array|[boolean,boolean,boolean,boolean]}
   */
  scenario.blobAdd = function (inds, blob) {
    var rdif, tdims, bdims, divis, lims, i, j, icv, b2, gtmid, gtmin, gtmax, tmin, bmin, atmax, len0, len1,
        tcoef, bcoef, hei, tp, bp, bc0rd, tp1, bp1;
    rdif = 1;
    tdims = [this.mainSize, this.mainSize];
    bdims = [this.blobSize, this.blobSize];
    divis = [false, false, false, false];  // is overflowing on [left,right,top,bottom]
    lims = this.templims;
    if (!lims) {
      this.templims = new Int32Array(2 * (2 + 1));
      lims = this.templims;
    }
    for (i = 0; i < 2; i += 1) {
      icv = 3 * i;
      b2 = Math.floor((bdims[i]) / 2);
      gtmid = Math.round(inds[i] * this.blobSize); // this.mid in greater resolution
      gtmin = gtmid - b2;                        // this.min in greater resolution (partially floored)
      gtmax = gtmid + b2;                        // this.max in greater resolution (partially floored)
      if (gtmin < 0) {
        tmin = 0;
        divis[i * 2] = true;
      } else {
        tmin = Math.ceil(gtmin / rdif);
      } // this.min floored
      bmin = tmin * rdif - gtmin;                                                 // offset of space.min
      atmax = gtmax / rdif;                                                     // this.max (not floored)
      if (atmax > tdims[i]) {
        atmax = tdims[i];
        divis[i * 2 + 1] = true;
      }
      lims[icv] = tmin;
      lims[icv + 1] = Math.floor(atmax);
      lims[icv + 2] = bmin;
    }
    len0 = lims[1] - lims[0];
    len1 = lims[4] - lims[3];
    if (len0 < 1 || len1 < 1) {
      return divis;
    }
    tcoef = [1, this.mainSize];
    bcoef = [1, this.blobSize];
    hei = inds[2];
    tp = lims[0] * tcoef[0] + lims[3] * tcoef[1]; // i,j-invariable part of indices for this
    bp = lims[2] * bcoef[0] + lims[5] * bcoef[1]; // i,j-invariable part of indices for space
    bc0rd = bcoef[0] * rdif;
    for (j = 0; j < len1; j += 1) {
      tp1 = tp + tcoef[1] * j;      // i-invariable part of tp
      bp1 = bp + bcoef[1] * j * rdif; // i-invariable part of bp
      for (i = 0; i < len0; i += 1) {
        //this.spacearr[tcoef[0]*(lims[0]+i)+tcoef[1]*(lims[3]+j)]+=hei*space.spacearr[bcoef[0]*(lims[2]+i*rdif)+bcoef[1]*(lims[5]+j*rdif)];
        this.data[tp1 + tcoef[0] * i] += hei * blob.data[bp1 + bc0rd * i];
      }
    }
    return divis;
  };
  scenario.checkResult = function () {
    this.compareResult(this.data.length, this.mainSize * this.mainSize);
    this.exportCanvas(this.data);
  };
  metadyn.addBlob1v1 = scenario;
})();
