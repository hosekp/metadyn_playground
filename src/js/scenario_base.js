"use strict";
(function () {
  /**
   * @typedef {Object} Result
   * @property {Scenario} scenario
   * @property {number} average
   * @property {number} deviation
   * @property {number} min
   * @property {number} max
   * @property {int} repeats
   * @property {number|null} [rmsd]
   * @property {Array.<number>} resultData
   */
  /**
   * @typedef {Object} FailedResult
   * @property {Scenario} scenario
   * @property {string} reason
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

  /** @typedef {{repeatId:number,start:number,prepared?:boolean,min:number,max:number,sum:number,sum2:number,resultData?:Array.<number>}} AsyncOptions */

  /**
   * @param {String} name
   * @param {String} category
   * @constructor
   * @property {string} name
   * @property {boolean} isAsync
   * @property {number} repeats
   * @property {String} name
   * @property {number} repeats
   * @property {String} category
   * @property {boolean} comparable
   * @property {string} skipReason
   */
  function Scenario(name, category) {
    this.name = name;
    this.category = category;
    this.comparable = false;
    this.wholeSeedCycle = 1;
    this.exportCanvasSize = 50;
    this.time = 5000; // milliseconds
  }

  Scenario.prototype.maxRepeats = 1000000;

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
   * @return {Promise.<Result|FailedResult>}
   */
  Scenario.prototype.execute = function () {
    if (this.skipReason) {
      return Promise.resolve({scenario: this, reason: this.skipReason});
    }
    var startTimestamp, endTimestamp, resultData;
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
        // console.log(this.name+": "+diff.toFixed(1)+"   "+i );
        sum += diff;
        if (max < diff) max = diff;
        if (min > diff) min = diff;
        sum2 += diff * diff;
        i++;
        if (i === this.wholeSeedCycle) {
          resultData = this.getResult();
        }
      }
      var repeats = i;
      return Promise.resolve({
        scenario: this,
        max: max,
        min: min,
        average: sum / repeats,
        deviation: Math.sqrt(sum2 / repeats - sum * sum / repeats / repeats),
        repeats: repeats,
        resultData: resultData
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
    // return i >= this.maxRepeats || time > 1000 && i >= 10 || time > 5000;
    return time > this.time;
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
        repeats: repeats,
        resultData: options.resultData
      });
    }
    options.repeatId++;
    if (options.repeatId === this.wholeSeedCycle) {
      options.resultData = this.getResult();
    }
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
    this.compareResult(results.resultData);
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
    if (result === null || result === undefined) {
      throw this.name + ": result is " + result;
    }
    if (result === correct) return true;
    if (result.length) {
      if (result.length !== correct.length) {
        throw this.name + ": result.length is different (" + result.length + "!=" + correct.length + ")";
      }
      for (var i = 0; i < result.length; i++) {
        if (typeof result[i] === "object") {
          if (JSON.stringify(result[i]) !== JSON.stringify(correct[i])) {
            throw this.name + ": value at " + i + " is different (" + result[i] + "!=" + correct[i] + ")";
          }
        } else {
          if (result[i] !== correct[i]) {
            throw this.name + ": value at " + i + " is different (" + result[i] + "!=" + correct[i] + ")";
          }
        }
      }
      return true;
    }
    throw this.name + ": " + result + " should be " + correct;
  };

  Scenario.prototype.getResult = function () {
    return Array.prototype.slice.call(this.data);
  };

  Scenario.prototype.correctResult = null;

  //####################################################################################################################
  metadyn.utils.extend(Scenario.prototype, {
    blobIndex: 0,
    getX: function () {
      // return 1;
      // return [0.2, 0.2, 0.2, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8][this.blobIndex++ % 9];
      // return (this.blobIndex++ * 0.12564) % 1
      return [
        0.7980540203359077,
        0.9825556627690173,
        0.5982910369930511,
        0.36701579682505026,
        0.13662579730888735,
        0.8307031338171411,
        0.26371464869896566,
        0.9195269955707515,
        0.14441090844223625
      ][this.blobIndex % 9];
    },
    getY: function () {
      // return 0;
      // return [0.2, 0.5, 0.8][this.blobIndex++ % 3];
      // return (this.blobIndex++ * 0.35648) % 1
      return [0.9272559753078882,
        0.6097978169692873,
        // 0.6495604494156946,
        0.05511689105549111,
        0.35578715052199117,
        0.8161721828933735,
        0.7017974569930172,
        0.4059239426430985,
        0.8989433867366583
      ][this.blobIndex++ % 8];
    },
    getHeight: function () {
      return 1;
      // return (index++ * 0.85642) % 1
    },
    prepareDataArray: function (dim) {
      var data = [];
      data.length = dim * dim;
      metadyn.utils.fillArray(data, 0);
      return data;
    },
    /**
     * @return {HTMLCanvasElement}
     */
    createCanvas: function () {
      // noinspection JSValidateTypes
      /** @type {HTMLCanvasElement} */
      var canvas = document.createElement("canvas");
      canvas.height = this.dim;
      canvas.width = this.dim;
      return canvas;
    },
    colorScale: function (d) {
      var sigma = 1000.0, hei = 380.0;
      return (255 << 24) |
          (Math.min(Math.max(hei - Math.abs(d - 0.77) * sigma, 0.0), 255.0) << 16) |
          (Math.min(Math.max(hei - Math.abs(d - 0.49) * sigma, 0.0), 255.0) << 8) |
          Math.min(Math.max(hei - Math.abs(d - 0.23) * sigma, 0.0), 255.0);
    },
    /**
     * @return {HTMLCanvasElement}
     */
    prepareExportCanvas: function (dataSize) {
      var size = this.exportCanvasSize;
      dataSize = dataSize || size;
      var canvas = this.createCanvas();
      canvas.setAttribute("width", dataSize.toString());
      canvas.setAttribute("height", dataSize.toString());
      canvas.style.width = size + "px";
      canvas.style.height = size + "px";
      canvas.style.imageRendering = "pixelated";
      canvas.style.border = "1px solid black";
      canvas.setAttribute("title", this.name);
      return canvas;
    }
  });
  metadyn.Scenario = Scenario;
})();
