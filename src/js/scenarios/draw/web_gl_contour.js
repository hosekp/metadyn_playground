(function () {
  "use strict";
  var scenario = new metadyn.Scenario("WebGL contour", 'Draw');
  metadyn.WebGLDrawScenario(scenario);
  metadyn.utils.extend(scenario, {
    shader:"2d-contour",
    contourStep: 0.2
  });
  metadyn.drawWebGLContour = scenario;
})();

