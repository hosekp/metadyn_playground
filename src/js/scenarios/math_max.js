(function () {
  var scenario = new metadyn.Scenario("Math.max([])",100,'Max');
  scenario.prepare=function () {
    var data=[];
    for(var i=0;i<125000;i++){
      data.push(i);
    }
    this.data = data;
  };
  scenario.syncScenario = function syncTest() {
    this.checkResult(Math.max.apply(null,this.data),124999);
  };
  metadyn.mathMaxArray = scenario;
})();
