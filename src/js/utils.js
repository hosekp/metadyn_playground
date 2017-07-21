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
  },
  findMaxMin:function(array,alsoMin){
    var max,min=0,len=array.length,
        maxs,mins,i,subarr,isTyped;
    isTyped=!!array.subarray;
    if(len<124000){
      max=Math.max.apply(null,array);
      if(alsoMin){
        min=Math.min.apply(null,array);
      }
    }else{
      maxs=[];mins=[];
      for(i=0;i<len/124000;i+=1){
        if(isTyped){
          subarr=array.subarray(i*124000,(i+1)*124000);
        }else{
          subarr=array.slice(i*124000,(i+1)*124000);
        }
        maxs.push(Math.max.apply(null,subarr));
        if(alsoMin){
          mins.push(Math.min.apply(null,subarr));
        }
      }
      max=Math.max.apply(null,maxs);
      if(alsoMin){
        min=Math.min.apply(null,mins);
      }
    }
    return [max,min];
  }

};
