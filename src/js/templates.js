window.metadyn = window.metadyn || {};
"use strict";
(function () {
  /**
   *
   * @constructor
   */
  function Templates() {
  }
  metadyn.Templates = Templates;

  Templates.mainResults = '\
    {{#results}}\
      <div class="result_line">\
        <span class="result_label">{{name}}:</span><span class="result_value">{{time}} ms</span>\
      </div>\
    {{/results}}\
  ';
})();
