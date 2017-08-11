(function (metadyn) {
  metadyn.tests = {
    colorScale: function () {
      var cycles = 100000;
      for (var i = 0; i < cycles; i++) {
        var value = 1 / cycles;
        var c1 = metadyn.drawRasterNaive.colorScale(value);
        var c2 = metadyn.drawRasterInt32.split(metadyn.drawRasterInt32.colorScale(value));
        for (var j = 0; j < 4; j++) {
          if (c1[j] !== c2[j]) {
            debugger;
          }
        }
      }
    },
    executeTest: function () {
      var start = window.performance.now();
      var nowPrint = function () {
        return (window.performance.now() - start).toFixed(0);
      };
      new Promise(function (p1, p2) {
        setTimeout(p1, 1000);
      })
          .then(function () {
            metadyn.utils.log("First " + nowPrint());
          })
          .then(this.delay)
          .then(function () {
            metadyn.utils.log("Second " + nowPrint());
            return 5;
          })
          .then(function (val) {
            return new Promise(function (p1, p2) {
              setTimeout(function () {
                p1(val);
                metadyn.utils.log("Third " + nowPrint());
              }, 1000);
            })
          })
          .then(metadyn.Main.prototype.delay)
          .then(function (val) {
            metadyn.utils.log("Forth " + nowPrint());
            metadyn.utils.log("value = " + val)
          })
    }
  };
})(metadyn);
