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
      <th>Repeats</th>\
      <th>RMSD</th>\
    </tr>\
    {{#categories}}\
      <tr><td class="category_label">{{name}}</td></tr>\
      {{#results}}\
        <tr class="result_line">\
          {{^reason}}\
          <td class="result_label">{{name}}:</td>\
          <td class="result_value">{{average}}</td>\
          <td>± {{deviation}} ms</td>\
          <td>{{min}}</td>\
          <td>{{max}}</td>\
          <td>{{whole}} ms</td>\
          <td>{{repeats}}</td>\
          <td>{{rmsd}}</td>\
          {{/reason}}\
          {{#reason}}\
          <td class="result_label">{{name}}:</td>\
          <td colspan="7" class="result_failed_reason">{{reason}}</td>\
          {{/reason}}\
        </tr>\
      {{/results}}\
    {{/categories}}\
    </table>\
    {{#finished}}\
      All Scenarios finished\
    {{/finished}}\
  ';
})();
