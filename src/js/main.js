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
     * @type {Array.<{name:string,time:string}>}
     * @private
     */
    this._results = [];
  }

  Main.prototype.execute = function () {
    this._pointer = 0;
    this._next();
  };
  Main.prototype.printResults = function () {
    document.getElementById("results_cont").innerHTML = Mustache.render(metadyn.Templates.mainResults, {results: this._results});
  };
  Main.prototype._next = function () {
    if (this._pointer === this._scenarios.length) {
      console.log("printing results");
      this.printResults();
    } else {
      /** @type {Scenario} */
      var scenario = this._scenarios[this._pointer];
      var self = this;
      console.log("starting scenario " + scenario.name);
      scenario.execute(function (time) {
        self._results.push({name: scenario.name, time: time.toFixed(2)});
        console.log("scenario " + scenario.name + " finished");
        self._pointer++;
        self._next();
      });
    }
  };

  Main.prototype.addScenarios = function () {
    for(var i=0;i<arguments.length;i++){
      this._scenarios.push(new arguments[i]());
    }
  };
  metadyn.Main = Main;
})();

