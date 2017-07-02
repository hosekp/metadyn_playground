(function () {
  /**
   * @typedef {Object} Result
   * @property {Scenario} scenario
   * @property {number} average
   * @property {number} deviation
   * @property {number} min
   * @property {number} max
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
  /** @typedef {{repeatId:number,finalCallback:ScenarioFinished,start:number,prepared?:boolean,min:number,max:number,sum:number,sum2:number}} AsyncOptions */

  /**
   * @property {string} name
   * @property {boolean} isAsync
   * @property {number} repeats
   * @property {String} name
   * @property {number} repeats
   * @property {String} category
   * @constructor
   * @param {String} name
   * @param {number} repeats
   * @param {String} category
   */
  function Scenario(name, repeats, category) {
    this.name = name;
    this.repeats = repeats;
    this.category = category;
  }

  var emptyFunction = function () {
  };
  var emptyCallbackFunction = function () {
  };
  /**
   *
   * @param {ScenarioFinished} callback
   * @param {AsyncOptions} [options]
   */
  Scenario.prototype.execute = function (callback, options) {
    if (this.prepare !== emptyFunction) {
      this.prepare();
    } else if (this.asyncPrepare !== emptyCallbackFunction
        && !(options && options.prepared)) {
      var self = this;
      options = {};
      this.asyncPrepare(function () {
        options.prepared = true;
        self.execute(callback);
      });
      return;
    }
    var startTimestamp, endTimestamp;
    if (this.syncScenario !== emptyFunction) {
      var sum = 0;
      var max = 0;
      var min = Infinity;
      var sum2 = 0;
      for (var i = 0; i < this.repeats; i++) {
        startTimestamp = performance.now();
        this.syncScenario();
        endTimestamp = performance.now();
        var diff = endTimestamp - startTimestamp;
        sum += diff;
        if (max < diff) max = diff;
        if (min > diff) min = diff;
        sum2 += diff * diff;
      }
      var repeats = this.repeats;
      return callback({
        scenario: this,
        max: max,
        min: min,
        average: sum / repeats,
        deviation: Math.sqrt(sum2 / repeats - sum * sum / repeats / repeats)
      });
    } else if (this.asyncScenario !== emptyCallbackFunction) {
      options = {
        start: 0,
        repeatId: 0,
        finalCallback: callback,
        prepared: true,
        sum: 0,
        max: 0,
        min: Infinity,
        sum2: 0
      };
      this._nextRepeat(options);
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
   * @private
   */
  Scenario.prototype._nextRepeat = function (options) {
    if (options.repeatId === this.repeats) {
      var repeats = this.repeats;
      return options.finalCallback({
        scenario: this,
        max: options.max,
        min: options.min,
        average: options.sum / repeats,
        deviation: Math.sqrt(options.sum2 / repeats - options.sum * options.sum / repeats / repeats)
      });
    }
    options.repeatId++;
    var self = this;
    options.start = performance.now();
    this.asyncScenario(function () {
      var endTimestamp = performance.now();
      var diff = endTimestamp - options.start;
      options.sum += diff;
      if (options.max < diff) options.max = diff;
      if (options.min > diff) options.min = diff;
      options.sum2 += diff * diff;
      self._nextRepeat(options);
    });

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
  metadyn.Scenario = Scenario;
})();
