"use strict";
(function () {
  var scenario = new metadyn.Scenario("Reference", 'Extremes');
  metadyn.MeasureScenario(scenario);
  scenario.prepare = function () {
    this.prepareData(this.size);
  };
  scenario.syncScenario=function () {
    this.result = this.targetResult;
  };
  metadyn.extremesReference = scenario;
})();
