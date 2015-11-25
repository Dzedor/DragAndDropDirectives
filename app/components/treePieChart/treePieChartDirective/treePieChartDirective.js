'use strict';

angular
  .module('App.treePieChart')
  .directive('treePieChart', treePieChart);

function treePieChart() {
  return {
    link: link,
    restrict: 'E',
    templateUrl: 'app/components/treePieChart/treePieChartDirective/treePieChartDirectiveTemplate.html',
    replace: true,
    scope: {
      title: '@',
      data: '=',
      selected: '=',
      selectionPercentage: '='
    }
  };

  function link(scope, element, attrs) {
    var radius = 250,
      color = d3.scale.category10(),
      totalSize = 0;

    scope.selectionPercentage = 0;

    var svg = d3.select(element[0]).select('#chart')
      .attr({ width: 2 * radius,  height: 2 * radius })
      .append('g')
      .attr('transform', 'translate(' + radius + ',' + radius + ')');

    var percentsText = svg.append('text')
      .attr({
        'font-size': '3em',
        'text-anchor': 'middle',
        fill: '#666666'
      })
      .style('visibility', 'hidden');

    var selectionSummary = d3.select(element[0]).select('#selectionSummary')
      .attr('fill', '#666666')
      .style('visibility', 'hidden');

    var partition = d3.layout.partition()
      .sort(null)
      .size([2 * Math.PI, radius * radius])
      .value(function(d) { return d.size; });

    var arc = d3.svg.arc()
      .startAngle(function(d) { return d.x; })
      .endAngle(function(d) { return d.x + d.dx; })
      .innerRadius(function(d) { return Math.sqrt(d.y); })
      .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

    scope.$watch('data', function() {
      drawChart();
    });


    function drawChart() {
      if (scope.data) {
        var path = svg.datum(scope.data)
          .selectAll('path')
          .data(partition.nodes)
          .enter()
          .append('path')
          .attr('display', function(d) { return d.depth ? null : 'none'; })
          .attr('d', arc)
          .style('stroke', '#fff')
          .style('fill', function(d) { return color((d.children ? d : d.parent).name); })
          .on('mouseover', mouseOver)
          .on('click', mouseClick);

        svg.on('mouseleave', mouseLeave);

        totalSize = path.node().__data__.value;

        if (scope.selected) {
          highlightNode(scope.selected);
        }
      }
    }

    function mouseOver(e) {
      highlightNode(e.name);
    }

    function mouseClick(e) {
      if (scope.selected === e.name) {
        scope.selected = '';
        cancelHighlighting();
      } else {
        scope.selected = e.name;
        highlightNode(e.name);
      }
    }

    function mouseLeave(e) {
      cancelHighlighting();
      if (scope.selected) {
        highlightNode(scope.selected);
      }
    }

    function getAncestors(node) {
      var path = [];
      var current = node;
      while (current && current.parent) {
        path.unshift(current);
        current = current.parent;
      }
      return path;
    }

    function highlightNode(nodeName) {
      var selectedNode;
      svg.selectAll('path')
        .each(function(node) { if (node.name === nodeName) { selectedNode = node; } });

      if (!selectedNode) {
        return;
      }

      var sequenceArray = getAncestors(selectedNode),
        percentage = (100 * selectedNode.value / totalSize).toPrecision(3),
        selection = sequenceArray.map(function(n) { return n.name; }).join(' > ');

      scope.selectionPercentage = percentage;

      percentsText
        .text(percentage + '%')
        .style('visibility', '');

      selectionSummary
        .text(selection)
        .style('visibility', '');

      svg.selectAll('path')
        .style('opacity', 0.5);

      svg.selectAll('path')
        .filter(function(node) { return (sequenceArray.indexOf(node) >= 0); })
        .style('opacity', 1);
    }

    function cancelHighlighting() {
      svg.selectAll('path').style('opacity', 1);
      percentsText.style('visibility', 'hidden');
      selectionSummary.style('visibility', 'hidden');
      scope.selectionPercentage = 0;
    }
  }
}
