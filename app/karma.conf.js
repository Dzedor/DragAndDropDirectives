module.exports = function(config) {
  config.set({

    basePath: '../',

    files: [
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/angular/angular.min.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/angular-ui-router/build/angular-ui-router.min.js',
      'node_modules/angular-ui-bootstrap/ui-bootstrap-tpls.min.js',
      'node_modules/d3/d3.min.js',
      'app/components/*.js',
      'app/components/**/*.js',
      'app/components/**/*Spec.js',

      //Templates
      'app/components/treePieChart/treePieChartDirective/treePieChartDirectiveTemplate.html'
    ],

    autoWatch: true,

    frameworks: ['jasmine'],

    plugins: [
      'karma-chrome-launcher',
      'karma-jasmine',
      'karma-jasmine-html-reporter-livereload',
      'karma-ng-html2js-preprocessor'
    ],
    preprocessors: {

      'app/components/treePieChart/treePieChartDirective/treePieChartDirectiveTemplate.html': 'ng-html2js'
    },

    reporters: ['progress', 'html'],

    browsers: ['Chrome']
  })
}
