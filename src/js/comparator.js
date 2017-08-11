(function () {
  "use strict";

  /**
   * @property {Object.<String,Comparator>} comparatorMap
   * @constructor
   */
  function Comparators() {
    this.comparatorMap = {};
  }

  /**
   *
   * @param {String} name
   * @param {Array.<number>} result
   * @return {number|null}
   */
  Comparators.prototype._compare = function (name, result) {
    if (!result) return null;
    if (this.comparatorMap[name]) {
      return this.comparatorMap[name].compare(result);
    } else {
      this.comparatorMap[name] = new Comparator(name, result);
      return 0;
    }
  };
  /**
   * @param {Scenario} scenario
   * @param {Array.<number>} resultData
   * @return {number|null}
   */
  Comparators.prototype.compare = function (scenario, resultData) {
    if(!scenario.comparable) return null;
    // console.log(resultData);
    return this._compare(scenario.category, resultData);
  };

  metadyn.Comparators = Comparators;

  //####################################################################################################################
  /**
   *
   * @param {String} name
   * @param {Array.<number>} reference
   * @property {String} name
   * @property {Array.<number>} reference
   * @constructor
   */
  function Comparator(name, reference) {
    this.name = name;
    this.reference = reference;
  }

  /**
   *
   * @param {Array.<number>} result
   * @return {number}
   */
  Comparator.prototype.compare = function (result) {
    var reference = this.reference;
    if (result.length !== reference.length) {
      throw "Different length of data for " + this.name + " comparator: " + result.length + "!==" + reference.length;
    }
    var sum = 0, sum2 = 0, len = result.length;
    for (var i = 0; i < len; i++) {
      var diff = Math.abs(result[i] - reference[i]);
      sum += diff;
      sum2 += diff * diff;
    }
    return Math.sqrt(sum2 / len - sum * sum / len / len);
  };
})();
