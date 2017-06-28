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
    <table>\
    <tr>\
      <th>Name</th>\
      <th>Average</th>\
      <th>Deviation</th>\
      <th>Min</th>\
      <th>Max</th>\
      <th>Whole</th>\
    </tr>\
    {{#categories}}\
      <tr><td class="category_label">{{name}}</td></tr>\
      {{#results}}\
        <tr class="result_line">\
          <td class="result_label">{{name}}:</td>\
          <td class="result_value">{{average}}</td>\
          <td>± {{deviation}} ms</td>\
          <td>{{min}}</td>\
          <td>{{max}}</td>\
          <td>{{whole}} ms</td>\
        </tr>\
      {{/results}}\
    {{/categories}}\
    </table>\
    {{#finished}}\
      All Scenarios finished\
    {{/finished}}\
  ';
})();
