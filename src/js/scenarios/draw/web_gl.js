(function () {
  "use strict";
  var scenario = new metadyn.Scenario("WebGL", 'Draw');
  metadyn.WebGLDrawScenario(scenario);
  metadyn.utils.extend(scenario, {
    shader:"2d"
  });
  metadyn.drawWebGL = scenario;
})();

