"use strict";
(function () {
  var scenario = new metadyn.Scenario("Box checker", 'Extremes');
  metadyn.MeasureScenario(scenario);
  scenario.prepare = function () {
    this.prepareData(this.size);
  };
  scenario.syncScenario = function syncTest() {
    var resol = this.size;
    var ix, iy = 0;
    var extremes = [];
    var steps = 2;
    for (ix = 0; ix < steps; ix++) {
      var x = ix / steps;
      for (iy = 0; iy < steps; iy++) {
        var y = iy / steps;
        var sx = Math.floor(x * resol);
        var sy = Math.floor((1 - y - 1 / steps) * resol);
        var ex = Math.floor((x + 1 / steps) * resol);
        var ey = Math.floor((1 - y) * resol);
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
    var yMins = [];
    for (var y = sy; y < ey; y++) {
      var yMin = trans.subarray(sx + y * resol, ex + y * resol).reduce(function(prev, curr) {
        return (prev > curr) ? prev : curr;
      }, -Infinity);
      // var yMin = Math.max.apply(Math, trans.subarray(sx + y * resol, ex + y * resol));
      yMins.push(yMin);
    }
    var min = Math.max.apply(Math, yMins);
    for (var i = 0; i < yMins.length; i++) {
      if (yMins[i] === min) break;
    }
    y = sy + i;
    if (y === 0) return null;
    if (y === resol - 1) return null;
    var row = trans.subarray(sx + y * resol, ex + y * resol);
    for (i = 0; i < row.length; i++) {
      if (row[i] === min) break;
    }
    var x = i + sx;
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
    return {x: x, y: y};
  };

  metadyn.extremesBoxChecker = scenario;
})();
