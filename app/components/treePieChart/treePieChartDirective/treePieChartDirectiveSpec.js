'use strict';

describe('Tree pie chart directive', function() {
  var el,
    scope,
    title = 'This is a test title';

  beforeEach(module('App.treePieChart'));
  beforeEach(module('app/components/treePieChart/treePieChartDirective/treePieChartDirectiveTemplate.html'));

  beforeEach(inject(function($compile, $rootScope) {
    scope = $rootScope.$new();
    var elText = '<tree-pie-chart data="items"' +
      'title="' + title + '" selected="selected"' +
      'selection-percentage="percentage"></tree-pie-chart>';

    el = angular.element(elText);
    $compile(el)(scope);
    scope.$digest();
  }));


  it('should not include tree-pie-chart element in the DOM', function() {
    expect(el[0].outerHTML).not.toContain('tree-pie-chart');
  });

  it('should render the title set in the attribute', function() {
    expect(el.text()).toContain(title);
  });

  describe('- selection percentage', function() {
    it('should equal 0% when nothing is selected', function() {
      scope.items = {
        name: '',
        children: [{
          name: '1',
          size: 500
        }]
      };
      scope.selected = null;
      scope.$digest();
      expect(+scope.percentage).toBe(0);
    });

    it('should equal 100% when there is only one element and it is selected', function() {
      scope.items = {
        name: '',
        children: [{
          name: '1',
          size: 500
        }]
      };
      scope.selected = '1';
      scope.$digest();
      expect(+scope.percentage).toBe(100);
    });

    it('should equal 50% when selected element takes 50% of the total size', function() {
      scope.items = {
        name: '',
        children: [{
          name: '1',
          size: 300
        }, {
          name: '2',
          children: [{
            name: "2.1",
            size: 125
          }, {
            name: "2.2",
            size: 175
          }]
        }]
      };
      scope.selected = '1';

      scope.$digest();

      expect(+scope.percentage).toBe(50);
    });
  });
});
