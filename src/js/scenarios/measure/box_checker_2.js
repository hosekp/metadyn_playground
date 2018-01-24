"use strict";
(function () {
  var scenario = new metadyn.Scenario("Box checker 2", 'Extremes');
  metadyn.MeasureScenario(scenario);
  scenario.prepare = function () {
    this.prepareData(this.size);
  };
  scenario.syncScenario = function syncTest() {
    var resol = this.size;
    var ix, iy = 0;
    var extremes = [];
    var steps = 10;
    for (ix = 0; ix < steps; ix++) {
      var x = ix / steps;
      for (iy = 0; iy < steps; iy++) {
        var sx = Math.floor(x * resol);
        var sy = resol - Math.floor((iy + 1) / steps * resol);
        var ex = Math.floor((x + 1 / steps) * resol);
        var ey = resol - Math.floor(iy / steps * resol);
        var ipos = this.findBoxedExtremes2(sx, sy, ex, ey);
        if (!ipos) continue;
        extremes.push([[
          (ipos.x + 0.5) / resol,
          1 - (ipos.y + 0.5) / resol
        ]]);
      }
    }
    this.result = extremes;
  };
  scenario.findBoxedExtremes2 = function (sx, sy, ex, ey) {
    var trans, resol;
    if (sx === ex || sy === ey) return null;
    trans = this.data;
    if (trans === null) return null;
    resol = this.size;
    var maxIndex = 0;
    var max = -Infinity;
    for (var y = sy; y < ey; y++) {
      var end = ex + y * resol;
      for (var i = sx + y * resol; i < end; i++) {
        if (trans[i] > max) {
          maxIndex = i;
          max = trans[i];
        }
      }
    }
    y = Math.floor(maxIndex / resol);
    var x = maxIndex % resol;
    // console.log({x:x,y:y});
    if (y === 0) return null;
    if (y === resol - 1) return null;
    if (x === 0) return null;
    if (x === resol - 1) return null;
    var val = trans[x + y * resol];
    if (x === sx) {
      if (val <= trans[(x - 1) + y * resol]) return null;
      if (y === sy) {
        if (val <= trans[(x - 1) + (y - 1) * resol]) return null;
      }
      if (y === ey - 1) {
        if (val <= trans[(x - 1) + (y + 1) * resol]) return null;
      }
    }
    if (x === ex - 1) {
      if (val <= trans[(x + 1) + y * resol]) return null;
      if (y === sy) {
        if (val <= trans[(x + 1) + (y - 1) * resol]) return null;
      }
      if (y === ey - 1) {
        if (val <= trans[(x + 1) + (y + 1) * resol]) return null;
      }
    }
    if (y === sy) {
      if (val <= trans[x + (y - 1) * resol]) return null;
    }
    if (y === ey - 1) {
      if (val <= trans[x + (y + 1) * resol]) return null;
    }
    // console.log({x:x,y:y,res:"returned"});
    return {x: x, y: y};
  };

  metadyn.extremesBoxChecker2 = scenario;
})();
