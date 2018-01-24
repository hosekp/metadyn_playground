"use strict";
(function () {
  var scenario = new metadyn.Scenario("Marbles", 'Extremes');
  metadyn.MeasureScenario(scenario);
  scenario.prepare = function () {
    this.prepareData(this.size);
  };
  scenario.syncScenario = function syncTest() {
    var resol = this.size;
    var ix, iy = 0;
    var extremes = [];
    var iExtremes = [];
    iExtremes.push({x: resol - 1, y: resol - 1});
      for (var x = 0.05; x < 1; x += 0.1) {
        for (var y = 0.05; y < 1; y += 0.1) {
          ix = Math.floor(x * resol);
          iy = Math.floor((1 - y) * resol);
          var ipos = this.iterateExtreme2(ix, iy, iExtremes);
          if (!ipos) continue;
          iExtremes.push(ipos);
          extremes.push([[
            ipos.x / resol,
            1 - ipos.y / resol
          ]]);
        }
      }
    this.result = extremes;
  };
  scenario.iterateExtreme2= function (ix, iy, others) {
    var trans, resol, val;
    trans = this.data;
    if (trans === null) return null;
    resol = this.size;
    var nextVal = trans[ix + iy * resol];
    while (true) {
      if (ix === 0) return null;
      if (ix === resol - 1) return null;
      if (iy === 0) return null;
      if (iy === resol - 1) return null;
      val = nextVal;
      nextVal = trans[ix - 1 + iy * resol];
      if (nextVal > val) {
        ix--;
        continue;
      }
      nextVal = trans[ix + 1 + iy * resol];
      if (nextVal >= val) {
        ix++;
        continue;
      }
      nextVal = trans[ix + (iy - 1) * resol];
      if (nextVal > val) {
        iy--;
        continue;
      }
      nextVal = trans[ix + (iy + 1) * resol];
      if (nextVal >= val) {
        iy++;
        continue
      }
      nextVal = trans[ix - 1 + (iy - 1) * resol];
      if (nextVal > val) {
        ix--;
        iy--;
        continue;
      }
      nextVal = trans[ix - 1 + (iy + 1) * resol];
      if (nextVal > val) {
        ix--;
        iy++;
        continue
      }
      nextVal = trans[ix + 1 + (iy - 1) * resol];
      if (nextVal > val) {
        ix++;
        iy--;
        continue;
      }
      nextVal = trans[ix + 1 + (iy + 1) * resol];
      if (nextVal >= val) {
        ix++;
        iy++;
        continue
      }
      break;
    }
    for (var i = 0; i < others.length; i++) {
      var other = others[i];
      if (other.x === ix && other.y === iy) return null;
    }
    return {x: ix, y: iy};
  };

  metadyn.extremesMarbles = scenario;
})();
