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
     * @type {{}}
     * @private
     */
    this._results = {};
    setTimeout(this.execute.bind(this), 1000);
  }

  Main.prototype.execute = function () {
    this._pointer=0;
    this._next();
    // for (var i = 0; i < this._scenarios.length; i++) {
    //   var scenario = this._scenarios[i];
    //   results[scenario.name] = scenario.execute();
    // }
  };
  Main.prototype.printResults=function () {
    document.getElementById("results_cont").innerHTML = Mustache.render(Templates.mainResults,{results:this._results});
  };
  Main.prototype._next = function () {
    // function () {
    //
    // }
    if(this._pointer===this._scenarios){
      this.printResults();
    }else{
      this._pointer++;
      this._next();
    }
  };

  Main.prototype.registerScenario = function (scenario) {
    this._scenarios.push(scenario);
  };
  metadyn.Main = Main;
})();

