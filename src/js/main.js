window.metadyn = window.metadyn || {};
"use strict";
(function () {
  /**
   * @constructor
   */
  function Main() {
    /**
     *
     * @type {Array}
     * @private
     */
    this._scenarios = [];
    /**
     * @type {number}
     * @private
     */
    this._pointer = 0;
    /**
     * @type {Array.<Result>}
     * @private
     */
    this._results = [];
  }

  Main.prototype.execute = function () {
    this._pointer = 0;
    this._next();
  };
  /**
   *
   * @param {boolean} finished
   * @private
   */
  Main.prototype._printResults = function (finished) {
    var formattedResults = [];
    var resultMap = {};
    for (var i = 0; i < this._results.length; i++) {
      var result = this._results[i];
      var formattedResult = {
        name: result.scenario.name,
        min: result.min.toFixed(2),
        max: result.max.toFixed(2),
        average: result.average.toFixed(2),
        deviation: result.deviation.toFixed(2),
        whole: (result.average * result.repeats).toFixed(2),
        repeats: result.repeats
      };
      if (!resultMap[result.scenario.category]) {
        resultMap[result.scenario.category] = [];
        formattedResults.push({
          name: result.scenario.category,
          results: resultMap[result.scenario.category]
        });
      }
      resultMap[result.scenario.category].push(formattedResult);
    }
    document.getElementById("results_cont").innerHTML = Mustache.render(metadyn.Templates.mainResults, {
      categories: formattedResults,
      finished: finished
    });
  };
  Main.prototype._next = function () {
    if (this._pointer === this._scenarios.length) {
      this._printResults(true);
      return;
    }
    /** @type {Scenario} */
    var scenario = this._scenarios[this._pointer];
    var self = this;
    return scenario.prepareScenario()
        .then(scenario.execute.bind(scenario))
        .then(function (results) {
          scenario.checkResult();
          self._results.push(results);
          self._printResults(false);
          self._pointer++;
        })
        .then(this.delay.bind(this))
        .then(this._next.bind(this));


  };

  Main.prototype.delay = function (results) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve(results);
      }, 0);
    });
  };

  Main.prototype.addScenarios = function () {
    if (arguments.length && arguments[0] === false) return;
    for (var i = 0; i < arguments.length; i++) {
      if (!arguments[i]) {
        throw "You forget to include file with " + (i + 1) + ". scenario";
      }
      this._scenarios.push(arguments[i]);
    }
  };

  Main.prototype.executeTest = function () {
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
        .then(this.delay)
        .then(function (val) {
          metadyn.utils.log("Forth " + nowPrint());
          metadyn.utils.log("value = " + val)
        })
  };
  metadyn.Main = Main;
})();

