(function () {
  /**
   * @callback ScenarioFinished
   * @param {number}
   * @return {undefined}
   */
  /** @callback RepeatFinished */
  /** @typedef {{repeatId:number,finalCallback:ScenarioFinished,start:number}} asyncOptions */
  /** @external performance */

  /**
   * @property {string} name
   * @property {boolean} isAsync
   * @property {number} repeats
   * @constructor
   */
  function Scenario() {
  }

  Scenario.prototype.name = "default Scenario";
  Scenario.prototype.repeats = 3;
  /**
   *
   * @param {ScenarioFinished} callback
   */
  Scenario.prototype.execute = function (callback) {
    var startTimestamp = performance.now();
    if (this.syncScenario !== Scenario.prototype.syncScenario) {
      for (var i = 0; i < this.repeats; i++) {
        this.syncScenario();
      }
      var endTimestamp = performance.now();
      return callback(endTimestamp - startTimestamp);
    } else if (this.asyncScenario !== Scenario.prototype.asyncScenario) {
      var options = {
        repeatId: 0,
        finalCallback: callback,
        start: startTimestamp
      };
      this._nextRepeat(options);
    } else {
      throw "missing scenario " + this.name;
    }
  };
  /**
   * @param {asyncOptions} options
   * @private
   */
  Scenario.prototype._nextRepeat = function (options) {
    if (options.repeatId === this.repeats) {
      console.log("repeats reached " + this.repeats);
      var endTimestamp = performance.now();
      return options.finalCallback(endTimestamp - options.start);
    }
    options.repeatId++;
    var self = this;
    console.log("repeatId " + options.repeatId);
    this.asyncScenario(function () {
      self._nextRepeat(options);
    });

  };
  Scenario.prototype.syncScenario = function () {

  };
  /**
   * @param {RepeatFinished} [callback]
   */
  Scenario.prototype.asyncScenario = function (callback) {
    setTimeout(function () {
      callback()
    }, 1000);
  };
  metadyn.Scenario = Scenario;
})();
