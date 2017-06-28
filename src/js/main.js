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
        whole: (result.average * result.scenario.repeats).toFixed(2)
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
    scenario.execute(function (results) {
      self._results.push(results);
      self._printResults(false);
      self._pointer++;
      self._next();
    });

  };

  Main.prototype.addScenarios = function () {
    for (var i = 0; i < arguments.length; i++) {
      this._scenarios.push(arguments[i]);
    }
  };
  metadyn.Main = Main;
})();

