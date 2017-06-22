(function () {
  /**
   * @extends {Scenario}
   * @constructor
   */
  function SyncTest() {
  }

  metadyn.utils.extendClass(SyncTest, metadyn.Scenario);

  var proto = SyncTest.prototype;
  proto.name = "Sync test";
  proto.repeats = 10000;
  proto.syncScenario = function syncTest() {
    var result = 0;
    for (var i = 0; i < 1000; i++) {
      result += i;
    }
  };

  metadyn.SyncTest = SyncTest;
})();
