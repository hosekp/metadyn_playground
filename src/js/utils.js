window.metadyn = window.metadyn || {};
"use strict";
metadyn.utils = {
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
  }

};
