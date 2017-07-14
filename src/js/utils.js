window.metadyn = window.metadyn || {};
"use strict";
metadyn.utils = {
  logLevel: 4,
  _previousLogs: [],
  _consoleElement: null,
  /**
   * Makes [Child] class ascendant of the [Parent] class
   * @type {Function}
   * @param {Object} Child
   * @param {Object} Parent
   * @return {Object}
   */
  extendClass: function (Child, Parent) {
    var F = new Function();
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
    Child.superclass = Parent.prototype;
    return Child;
  },
  extend: function (first, second) {
    var keys = Object.getOwnPropertyNames(second);
    for (var i = 0; i < keys.length; i++) {
      first[keys[i]] = second[keys[i]];
    }
  },
  _initConsole: function () {
    this._consoleElement = document.getElementById("console_cont");
  },
  _addText: function (string, logLevel) {
    var logs;
    if (this.logLevel < logLevel) return;
    if (this._consoleElement === null) {
      this._initConsole();
    }
    logs = this._previousLogs;
    logs.push("<div class='cons_text_level_" + logLevel + "'>" + string + "</div>");
    if (logs.length > 20) {
      logs.shift();
    }
    this._consoleElement.innerHTML = logs.join("");
  },
  debug: function (text) {
    this._addText(text, 4)
  },
  log: function (text) {
    this._addText(text, 3)
  },
  warning: function (text) {
    this._addText(text, 2)
  },
  error: function (text) {
    this._addText(text, 1)
  }

};
