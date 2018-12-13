"use strict";
window.metadyn = window.metadyn || {};
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
     * @type {Array.<Result|FailedResult>}
     * @private
     */
    this._results = [];
  }

  Main.prototype.execute = function () {
    this.comparators = new metadyn.Comparators();
    this._pointer = 0;
    this._next().catch(function (e) {
      throw e;
    });
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
      /** @type {Result|FailedResult} */
      var result = this._results[i];
      if (result.reason) {
        var formattedResult = {
          name: result.scenario.name,
          reason: result.reason
        };
      } else {
        formattedResult = {
          name: result.scenario.name,
          min: result.min.toFixed(2),
          max: result.max.toFixed(2),
          average: result.average.toFixed(2),
          deviation: result.deviation.toFixed(2),
          whole: (result.average * result.repeats).toFixed(2),
          repeats: result.repeats,
          rmsd: result.rmsd === null ? "---" : result.rmsd.toPrecision(3)
        };
      }
      if (!resultMap[result.scenario.category]) {
        resultMap[result.scenario.category] = [];
        formattedResults.push({
          category: result.scenario.category,
          results: resultMap[result.scenario.category]
        });
      }
      resultMap[result.scenario.category].push(formattedResult);
    }
    if (finished) {
      var userClientObject = metadyn.utils.extend(metadyn.BrowserDetection(), {
        platform: navigator.platform,
        product: navigator.product,
        hardwareConcurrency: navigator.hardwareConcurrency,
        language: navigator.language
      });
      var userClient = Object.getOwnPropertyNames(userClientObject).map(function (key) {
        return {name: key, value: userClientObject[key]};
      });
    }
    var mustacheData = {
      categories: formattedResults,
      finished: finished,
      userClient: userClient
    };
    document.getElementById("results_cont").innerHTML = Mustache.render(metadyn.Templates.mainResults, mustacheData);
    document.getElementById("csv_cont").innerHTML = Mustache.render(metadyn.Templates.csvResults, mustacheData);
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
        .then(function (result) {
          if (!result.reason) {
            scenario.checkResult(result);
            result.rmsd = self.comparators.compare(scenario, result.resultData);
          }
          self._results.push(result);
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
  metadyn.Main = Main;
})();

