(function () {
  /**
   * @typedef {Function} ScenarioFinished
   * @param {String}
   */

  /**
   *
   * @param name
   * @constructor
   */
  function Scenario(name) {
    this.name = name
  }

  /**
   *
   * @param {ScenarioFinished} callback
   */
  Scenario.prototype.execute = function (callback) {
    setTimeout(function(){callback("data")}, 1000);
  }
})();
