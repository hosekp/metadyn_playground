"use strict";
(function () {
  var scenario = new metadyn.Scenario("Naive Checker", 'Extremes');
  metadyn.MeasureScenario(scenario);
  scenario.prepare = function () {
    this.prepareData(this.size);
  };
  scenario.syncScenario = function syncTest() {
    var resol = this.size;
    var ix, iy = 0;
    var extremes = [];
    for (ix = 0; ix < resol; ix++) {
      for (iy = 0; iy < resol; iy++) {
        var ipos = this.iterateExtreme2(ix, iy);
        if (!ipos) continue;
        extremes.push([[
          ipos.x / resol,
          1 - ipos.y / resol
        ]]);
      }
    }
    this.result = extremes;
  };
  scenario.iterateExtreme2= function (ix, iy) {
    var trans, resol, val;
    trans = this.data;
    if (trans === null) return null;
    resol = this.size;
    var nextVal = trans[ix + iy * resol];
      if (ix === 0) return null;
      if (ix === resol - 1) return null;
      if (iy === 0) return null;
      if (iy === resol - 1) return null;
      val = nextVal;
      nextVal = trans[ix - 1 + iy * resol];
      if (nextVal > val) {
        return null;
      }
      nextVal = trans[ix + 1 + iy * resol];
      if (nextVal >= val) {
        return null;
      }
      nextVal = trans[ix + (iy - 1) * resol];
      if (nextVal > val) {
        return null;
      }
      nextVal = trans[ix + (iy + 1) * resol];
      if (nextVal >= val) {
        return null
      }
      nextVal = trans[ix - 1 + (iy - 1) * resol];
      if (nextVal > val) {
        return null;
      }
      nextVal = trans[ix - 1 + (iy + 1) * resol];
      if (nextVal > val) {
        return null
      }
      nextVal = trans[ix + 1 + (iy - 1) * resol];
      if (nextVal > val) {
        return null;
      }
      nextVal = trans[ix + 1 + (iy + 1) * resol];
      if (nextVal >= val) {
        return null
      }
    return {x: ix, y: iy};
  };

  metadyn.extremesNaiveChecker = scenario;
})();
