'use strict';

angular
  .module('App.countryInput', [])
  .directive('countryInput', countryInput);

countryInput.$inject = [];

function countryInput() {
  return {
    link: link,
    restrict: 'E',
    templateUrl: 'app/components/countrySelection/countryInputDirective/countryInputDirectiveTemplate.html',
    scope: {}
  };

  function link(scope, element, attrs) {
    var w = 800,
      h = 600;

    var projection = d3.geo.mercator()
      .translate([w / 2, h / 2])
      .scale(120);

    var path = d3.geo.path().projection(projection);

    var svg = d3.select(element[0]).select("svg")
      .attr("width", w)
      .attr("height", h);

    d3.json("app/components/countrySelection/countryInputDirective/worldcountries.geo.json", function(json) {

      svg.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", "#666666");
    });
  }
}
