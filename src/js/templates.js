"use strict";
window.metadyn = window.metadyn || {};
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
      <tr><td class="category_label">{{category}}</td></tr>\
      {{#results}}\
        <tr class="result_line">\
          <td class="result_label">{{name}}:</td>\
          {{^reason}}\
          <td class="result_value">{{average}}</td>\
          <td>± {{deviation}} ms</td>\
          <td>{{min}}</td>\
          <td>{{max}}</td>\
          <td>{{whole}} ms</td>\
          <td>{{repeats}}</td>\
          <td>{{rmsd}}</td>\
          {{/reason}}\
          {{#reason}}\
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
  Templates.csvResults = '\
  <textarea class="csv_export">\
Category;Name;Average;Deviation;Min;Max;Whole;Repeats;RMSD;\
{{#categories}}\
{{#results}}\
\n{{category}};{{name}};{{average}};{{deviation}};{{min}};{{max}};{{whole}};{{repeats}};{{rmsd}};\
{{/results}}\
{{/categories}}\
\
{{#userClient}}\
\n\
{{name}};{{value}};\
{{/userClient}}\
</textarea>\
';
})();
