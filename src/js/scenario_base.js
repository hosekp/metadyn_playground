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
   * @constructor
   * @param {String} name
   * @param {String} category
   */
  function Scenario(name, category) {
    this.name = name;
    this.category = category;
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
   * @return {Promise}
   */
  Scenario.prototype.execute = function () {
    var startTimestamp, endTimestamp;
    if (this.syncScenario !== emptyFunction) {
      var sum = 0;
      var max = 0;
      var min = Infinity;
      var sum2 = 0;
      for (var i = 0; i < this.maxRepeats; i++) {
        startTimestamp = performance.now();
        this.syncScenario();
        endTimestamp = performance.now();
        var diff = endTimestamp - startTimestamp;
        sum += diff;
        if (max < diff) max = diff;
        if (min > diff) min = diff;
        sum2 += diff * diff;
        if (sum > 1000) {
          i++;
          break;
        }
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
  /** @type {EmptyCallback} */
  Scenario.prototype.prepare = emptyFunction;
  /** @type {AsyncFunction} */
  Scenario.prototype.asyncPrepare = emptyCallbackFunction;
  /**
   * @param {AsyncOptions} options
   * @return {Promise}
   * @private
   */
  Scenario.prototype._nextRepeat = function (options) {
    if (options.repeatId === this.maxRepeats || options.sum > 1000) {
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
   *
   * @param {*} result
   * @param {*} correct
   */
  Scenario.prototype.checkResult = function (result, correct) {
    if (result !== correct) {
      throw "Wrong result on " + this.name + ": " + result + " should be " + correct;
    }
  };
  /** @type {EmptyCallback} */
  Scenario.prototype.getResults = emptyFunction;

  metadyn.Scenario = Scenario;
})();
