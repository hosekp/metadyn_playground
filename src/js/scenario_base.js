(function () {
  "use strict";
  /**
   * @typedef {Object} Result
   * @property {Scenario} scenario
   * @property {number} average
   * @property {number} deviation
   * @property {number} min
   * @property {number} max
   * @property {int} repeats
   * @property {number|null} [rmsd]
   */
  /**
   * @callback ScenarioFinished
   * @param {Result}
   * @return {undefined}
   */
  /** @callback EmptyCallback */
  /**
   * @callback AsyncFunction
   * @param {EmptyCallback} callback
   */

  /** @typedef {{repeatId:number,start:number,prepared?:boolean,min:number,max:number,sum:number,sum2:number}} AsyncOptions */

  /**
   * @property {string} name
   * @property {boolean} isAsync
   * @property {number} repeats
   * @property {String} name
   * @property {number} repeats
   * @property {String} category
   * @property {boolean} comparable
   * @constructor
   * @param {String} name
   * @param {String} category
   */
  function Scenario(name, category) {
    this.name = name;
    this.category = category;
    this.comparable = false;
  }

  Scenario.prototype.maxRepeats = 100000;

  var emptyFunction = function () {
  };
  var emptyCallbackFunction = function () {
  };
  /**
   * @return {Promise}
   */
  Scenario.prototype.prepareScenario = function () {
    if (this.prepare !== emptyFunction) {
      this.prepare();
    } else if (this.asyncPrepare !== emptyCallbackFunction) {
      var self = this;
      return new Promise(function (p1, p2) {
        self.asyncPrepare(p1, p2);
      });
    }
    return Promise.resolve();
  };
  /**
   *
   * @return {Promise.<Result>}
   */
  Scenario.prototype.execute = function () {
    var startTimestamp, endTimestamp;
    if (this.syncScenario !== emptyFunction) {
      var sum = 0;
      var max = 0;
      var min = Infinity;
      var sum2 = 0;
      var i = 0;
      while (!this._shouldBreakRepeats(i, sum)) {
        startTimestamp = performance.now();
        this.syncScenario();
        endTimestamp = performance.now();
        var diff = endTimestamp - startTimestamp;
        sum += diff;
        if (max < diff) max = diff;
        if (min > diff) min = diff;
        sum2 += diff * diff;
        i++;
      }
      var repeats = i;
      return Promise.resolve({
        scenario: this,
        max: max,
        min: min,
        average: sum / repeats,
        deviation: Math.sqrt(sum2 / repeats - sum * sum / repeats / repeats),
        repeats: repeats
      });
    } else if (this.asyncScenario !== emptyCallbackFunction) {
      var options = {
        start: 0,
        repeatId: 0,
        prepared: true,
        sum: 0,
        max: 0,
        min: Infinity,
        sum2: 0
      };
      return this._nextRepeat(options);
    } else {
      throw "missing scenario " + this.name;
    }
  };
  Scenario.prototype._shouldBreakRepeats = function (i, time) {
    var wholeSeedCycle = 9;
    return i % wholeSeedCycle === 0 && (i >= this.maxRepeats || time > 1000 && i >= 10 || time > 5000);
  };
  /** @type {EmptyCallback} */
  Scenario.prototype.prepare = emptyFunction;
  /** @type {AsyncFunction} */
  Scenario.prototype.asyncPrepare = emptyCallbackFunction;
  /**
   * @param {AsyncOptions} options
   * @return {Promise.<Result>}
   * @private
   */
  Scenario.prototype._nextRepeat = function (options) {
    if (this._shouldBreakRepeats(options.repeatId, options.sum)) {
      // if (options.repeatId === this.maxRepeats || (options.sum > 1000 && options.repeatId >= 10) || options.sum > 5000) {
      var repeats = options.repeatId;
      return Promise.resolve({
        scenario: this,
        max: options.max,
        min: options.min,
        average: options.sum / repeats,
        deviation: Math.sqrt(options.sum2 / repeats - options.sum * options.sum / repeats / repeats),
        repeats: repeats
      });
    }
    options.repeatId++;
    var self = this;
    options.start = performance.now();
    return new Promise(function (p1, p2) {
      return self.asyncScenario(p1, p2);
    }).then(function () {
      var endTimestamp = performance.now();
      var diff = endTimestamp - options.start;
      options.sum += diff;
      if (options.max < diff) options.max = diff;
      if (options.min > diff) options.min = diff;
      options.sum2 += diff * diff;
    }).then(function () {
      return self._nextRepeat(options);
    })
  };
  /** @type {EmptyCallback} */
  Scenario.prototype.syncScenario = emptyFunction;
  /** @type {AsyncFunction} */
  Scenario.prototype.asyncScenario = emptyCallbackFunction;

  /**
   * @param {Result} results
   * @return {boolean}
   */
  Scenario.prototype.checkResult = function (results) {
    if (this.getResult === emptyFunction) return false;
    this.compareResult(this.getResult());
  };
  /**
   *
   * @param result
   * @param [correct]
   * @return {boolean}
   */
  Scenario.prototype.compareResult = function (result, correct) {
    correct = correct || this.correctResult;
    if (correct === null) return false;
    if (!result) {
      throw this.name + ": result is " + result;
    }
    if (result === correct) return true;
    if (result.length) {
      if (result.length !== correct.length) {
        throw this.name + ": result.length is different (" + result.length + "!=" + correct.length + ")";
      }
      for (var i = 0; i < result.length; i++) {
        if (result[i] !== correct[i]) {
          throw this.name + ": value at " + i + " is different (" + result[i] + "!=" + correct[i] + ")";
        }
      }
      return true;
    }
    throw this.name + ": " + result + " should be " + correct;
  };

  Scenario.prototype.getResult = function () {
    return this.data;
  };

  Scenario.prototype.correctResult = null;

  metadyn.Scenario = Scenario;
})();
