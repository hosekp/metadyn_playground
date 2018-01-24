"use strict";
(function () {
  var scenario = new metadyn.Scenario("WebGL", 'Draw');
  metadyn.WebGLDrawScenario(scenario);
  metadyn.utils.extend(scenario, {
    shader:"2d"
  });
  metadyn.drawWebGL = scenario;
})();

