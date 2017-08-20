document.addEventListener("DOMContentLoaded", function (event) {
  var main = metadyn.main;
  //  document.getElementById("run_simulation").addEventListener("click",main.execute.bind(main));
  document.getElementById("run_test").addEventListener("click", metadyn.tests.executeTest.bind(main));
  setTimeout(main.execute.bind(main), 1000);
  //  main.execute();
  /** @param {MouseEvent} event */
  var openCsv = function (event) {
    this.classList.toggle("expanded");
    this.removeEventListener("click",openCsv);
    this.getElementsByClassName("csv_export")[0].select();
  };
  document.getElementById("csv_cont").addEventListener("click", openCsv)
});
