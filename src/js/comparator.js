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
   * @param {int} repeats
   * @return {number|null}
   */
  Comparators.prototype._compare = function (name, result, repeats) {
    if (!result) return null;
    if (this.comparatorMap[name]) {
      return this.comparatorMap[name].compare(result, repeats);
    } else {
      this.comparatorMap[name] = new Comparator(name, result, repeats);
      return 0;
    }
  };
  /**
   * @param {Scenario} scenario
   * @param {int} repeats
   * @return {number|null}
   */
  Comparators.prototype.compare = function (scenario, repeats) {
    if(!scenario.comparable) return null;
    return this._compare(scenario.category, scenario.getResult(), repeats);
  };

  metadyn.Comparators = Comparators;

  //####################################################################################################################
  /**
   *
   * @param {String} name
   * @param {Array.<number>} reference
   * @param {int} repeats
   * @property {String} name
   * @param {Array.<number>} reference
   * @constructor
   */
  function Comparator(name, reference, repeats) {
    this.name = name;
    this.reference = Array.from(reference, function (value) {
      return value / repeats;
    });
  }

  /**
   *
   * @param {Array.<number>} result
   * @param {int} repeats
   * @return {number}
   */
  Comparator.prototype.compare = function (result, repeats) {
    var reference = this.reference;
    if (result.length !== reference.length) {
      throw "Different length of data for " + this.name + " comparator: " + result.length + "!==" + reference.length;
    }
    var sum = 0, sum2 = 0, len = result.length;
    for (var i = 0; i < len; i++) {
      var diff = Math.abs(result[i] / repeats - reference[i]);
      sum += diff;
      sum2 += diff * diff;
    }
    return Math.sqrt(sum2 / len - sum * sum / len / len);
  };
})();
